from flask import Flask, render_template, request, session, redirect, url_for, abort
from flask_pymongo import PyMongo
from flask_wtf import FlaskForm
from wtforms import StringField, SelectField
from wtforms.validators import InputRequired, Email, DataRequired


class StudentLogin(FlaskForm):
    name = StringField('name', validators=[InputRequired()])
    usn = StringField('usn', validators=[InputRequired()])
    email = StringField('email', validators=[InputRequired(), Email()])


class NewQuestion(FlaskForm):
    question = StringField('question', validators=[DataRequired()])
    option1 = StringField('option1', validators=[DataRequired()])
    option2 = StringField('option2', validators=[DataRequired()])
    option3 = StringField('option3', validators=[DataRequired()])
    option4 = StringField('option4', validators=[DataRequired()])
    answer = SelectField('answer', validators=[DataRequired()], choices=[(1, 1), (2, 2), (3, 3), (4, 4)])


app = Flask(__name__)
app.config['MONGO_URI'] = "mongodb://localhost:27017/testerac"
app.secret_key = "pining for the fjords?"
app.config['WTF_CSRF_METHODS'] = []
mongo = PyMongo(app)


@app.route('/home')
@app.route('/')
def home():
    test_list = []
    tests = mongo.db.tests.find()
    for test in tests:
        test_list.append(test)
    return render_template('home.html', message="Enter login", tests=test_list)

@app.route('/adminlogin')
def adminlogin():
    return render_template('admin_login.html')

@app.route('/login')
def login():
    headers = request.headers
    usr = headers['name']
    password = headers['pass']
    if usr == 'admin' and password == 'pass':
        session['logged_in'] = True
        return 'success', 200
    else:
        session['logged_in'] = False
        abort(401)


@app.route('/admin', methods=['GET', 'POST', 'PUT', 'DELETE'])
def admin():
    test_list = []
    tests = mongo.db.tests.find()
    for test in tests:
        test_list.append(test)

    if not session.get('logged_in'):
        return redirect(url_for('home'))

    if request.method == 'GET':
        return render_template('admin_home.html', tests=test_list)

    elif request.method == 'POST':
        d = request.get_json()
        print(d)
        new_test = {
            'name': d['name'],
            'status': 'disabled',
            'student_list': [],
            'url': None,
            'questions': [],
            'ans_string': '',
            'duration': d['duration'],
            'test_no': 0,
        }
        no_of_tests = mongo.db.tests.count_documents({})
        if no_of_tests > 0:
            new_test['test_no'] = no_of_tests + 1
        new_test['url'] = 'test'+str(new_test['test_no'])
        mongo.db.tests.insert_one(new_test)
        url = '/admin/'+'test'+str(no_of_tests)
        return url

    elif request.method == 'PUT':
        d = request.get_json()
        test_url = d['test_url']
        key = d['key']
        val = d['value']
        test_obj = mongo.db.tests.find_one({'url': test_url})
        test_obj[key] = val
	print(key, val)
        mongo.db.tests.replace_one({'url': test_url}, test_obj)
        return 'ok'

    elif request.method == 'DELETE':
        d = request.get_json()
        test_url = d['test_url']
        mongo.db.tests.delete_one({'url': test_url})
        return 'ok'


@app.route('/admin/<test>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def admin_test(test):
    if not session.get('logged_in'):
        return redirect(url_for('home'))
    test_obj = mongo.db.tests.find_one({'url': test})
    form = NewQuestion()

    if request.method == 'GET':
        return render_template('admin_test.html', test=test_obj, form=form)

    elif request.method == 'POST':
        question = {
            'question': form.question.data,
            'options': [form.option1.data, form.option2.data, form.option3.data, form.option4.data]
        }
        test_obj = mongo.db.tests.find_one({'url': test})
        test_obj['questions'].append(question)
        test_obj['ans_string'] = test_obj['ans_string'] + str(form.answer.data)
        mongo.db.tests.replace_one({'url': test}, test_obj)
        return redirect('/admin/'+test)

    elif request.method == 'PUT':
        d = request.get_json()
        print(d)
        q_index = int(d['q_index'])
        test_obj = mongo.db.tests.find_one({'url': test})
        test_obj['questions'][q_index] = {'question': d['question'], 'options': d['options']}
        ans_str = test_obj['ans_string']
        test_obj['ans_string'] = ans_str[:q_index] + d['ans'] + ans_str[q_index+1:]
        mongo.db.tests.replace_one({'url': test}, test_obj)
        return 'ok', 200

    elif request.method == 'DELETE':
        d = request.get_json()
        q_index = int(d['q_index'])
        test_obj = mongo.db.tests.find_one({'url': test})
        ans_str = test_obj['ans_string']
        del test_obj['questions'][q_index]
        test_obj['ans_string'] = ans_str[:q_index] + ans_str[q_index+1:]
        mongo.db.tests.replace_one({'url': test}, test_obj)
        return 'ok', 200


@app.route('/admin/<test>/result', methods=['GET'])
def admin_results(test):
    if not session.get('logged_in'):
        return redirect(url_for('home'))
    test_obj = mongo.db.tests.find_one({'url': test})
    return render_template('test_results.html', test=test_obj)


@app.route('/finished', methods=['GET'])
def test_done():
    return render_template('exit_page.html')


@app.route('/user/<test>', methods=['GET', 'POST', 'PUT'])
def user(test):
    form = StudentLogin()

    if request.method == 'PUT':
        test_obj = mongo.db.tests.find_one({'url': test})
        res = request.get_json()['ans_str']
        ans_string = test_obj['ans_string']
        score = 0
        for x, y in zip(res, ans_string):
            if x == y:
                score = score + 1
        print(score)

        for student in test_obj['student_list']:
            if student['usn'] == request.get_json()['usn']:
                student['score'] = score
                student['ans_string'] = ans_string
        mongo.db.tests.replace_one({'url': test}, test_obj)
        return 'ok'

    if form.validate_on_submit():
        student = {
            'name': form.name.data,
            'usn': form.usn.data,
            'email': form.email.data,
            'ans_string': '',
            'score': 0
        }
        test_obj = mongo.db.tests.find_one({'url': test})
        test_obj['student_list'].append(student)
        mongo.db.tests.replace_one({'url': test}, test_obj)
        return render_template('user_test.html', test=test_obj, student=student)

    elif not form.validate_on_submit():
        return render_template('user.html', form=form)

    elif request.method == 'GET':
        return render_template('user.html', form=form, test=test)


if __name__ == '__main__':
    app.run()
