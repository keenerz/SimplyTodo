"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Todos
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token

api = Blueprint('api', __name__)

#User Endpoints
@api.route('/token', methods=['POST'])
def create_token():
    if request.json is None:
        return jsonify({"msg":"Missing the payload"}), 400
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    user = User.query.filter_by(email=email, password=password).first()
    if user is None:
        return jsonify({"msg": "Missing email or password"}), 401
    access_token = create_access_token(identity=user.id)
    return jsonify({ "token": access_token, "user_id": user.id, "email": user.email })

@api.route('/user', methods=['POST'])
def create_user():
    email = request.json.get('email')
    password = request.json.get('password')
    user = User(email=email, password=password)
    db.session.add(user)
    db.session.commit()
    return jsonify(user.serialize())

@api.route('/user', methods=['DELETE'])
@jwt_required()
def delete_user():
    email = request.json.get('email')
    password = request.json.get('password')
    user = User.query.filter_by(email=email, password=password).first()
    if user is None: 
        return jsonify({"msg": "Invalid user"}), 400
    db.session.delete(user)
    db.session.commit()
    return jsonify({ "msg": "User Deleted"}), 200

@api.route('/user', methods=['PUT'])
@jwt_required()
def update_user():
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(id=current_user_id).first()
    if user is None:
        return jsonify({"msg":"User doesn't exist"}), 400
    email = request.json.get('email')
    password = request.json.get('password')

    if email is None or not email:
        user.email = user.email
    else:
        user.email = email

    if password is None or not password:
        user.password = user.password
    else:
        user.password = password

    db.session.commit()
    return jsonify(user.serialize())

#Todo Endpoints
@api.route('/todos', methods=['GET'])
@jwt_required()
def get_todos():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user is None:
        return jsonify({"msg": "User Not Found"}), 403
    todos_query = Todos.query.filter_by(creator=current_user_id)
    all_serialized_todos = list(map(lambda item:item.serialize(), todos_query))
    return jsonify(all_serialized_todos)

@api.route('/todos', methods=['POST'])
@jwt_required()
def create_todos():
    task = request.json.get('task', None)
    stage = request.json.get('stage', None)
    duedate = request.json.get('duedate', None)
    creator = get_jwt_identity()
    
    todos = Todos(task=task,
        stage=stage,
        duedate=duedate,
        creator=creator)
    db.session.add(todos)
    db.session.commit()
    return jsonify(todos.serialize())

@api.route('/todos', methods=['PUT'])
@jwt_required()
def update_todo():
    current_user_id = get_jwt_identity()
    todoid = request.json.get('id')
    todo = Todos.query.filter_by(id=todoid, creator=current_user_id).first()
    if todo is None:
        return jsonify({"msg":"Item or User doesn't exist"}), 400
    task = request.json.get('task')
    stage = request.json.get('stage')
    duedate = request.json.get('duedate')

    if task is None or not task:
        todo.task = todo.task
    else:
        todo.task = task

    if stage is None or not stage:
        todo.stage = todo.stage
    else:
        todo.stage = stage

    if duedate is None or not duedate:
        todo.duedate = todo.duedate
    else:
        todo.duedate = duedate

    db.session.commit()
    return jsonify(todo.serialize())

@api.route('/todos', methods=['DELETE'])
@jwt_required()
def delete_todo():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    user_id = request.json.get('user')
    todo_id_get = request.json.get('id')
    target_todo = Todos.query.filter_by(creator=user_id, id=todo_id_get).first()
    if target_todo is None: 
        return jsonify({"msg": "Invalid todo"}), 400
    db.session.delete(target_todo)
    db.session.commit()
    return jsonify({ "msg": "Todo Deleted"}), 200