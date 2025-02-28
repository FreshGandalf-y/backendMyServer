from flask import Flask, request, jsonify
import mysql.connector
app = Flask (__name__)
import datetime 

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="chatchronic"
)

idCommand = 1

@app.route('/save', methods=['Post'])
def save_data():
    data = request.json
    username = data.get('myusrName')
    lastcommand = data.get('theLastCommand')
    usrtime = data.get('datetime')
    timeserver = datetime.datetime.now()


    print(username, lastcommand, usrtime, timeserver)

    my_coursor = db.cursor()
    sql = "INSERT INTO last_commands (id, username, time, timeserver, lastcommand) VALUES (%s, %s)"

    val = [
        (idCommand, username, usrtime, timeserver, lastcommand),
    ]

    my_coursor.executemany(sql, val)

    db.commit() 
    my_coursor.close()

    return jsonify({"message": "data succesfully saved"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)