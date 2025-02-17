from flask import Flask, request, jsonify
import mysql.connector
app = Flask (__name__)

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="chatchronic"
)

id = int

@app.route('/save', methods=['Post'])
def save_data():
    data = request.json
    username = data.get('myusrName')
    lastcommand = data.get('theLastCommand')


    print(username, lastcommand)

    my_coursor = db.cursor()
    sql = "INSERRT INTO last_command (id, username, time, Null, lastcommand) VALUES (%s, %s)"
    my_coursor.execute(sql)
    db.commit() 
    my_coursor.close()

    return jsonify({"message": "data succesfully saved"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)