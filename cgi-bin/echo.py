#!/usr/bin/python3
# -*- coding: UTF-8 -*-# enable debugging
# Reflects the provided URL back to the user
import cgi
import cgitb
import json
import requests
cgitb.enable(display=0, logdir="/var/log/apache2")
form = cgi.FieldStorage()
url = form["url"].value

print("Content-Type: text/html;charset=utf-8")
print()
#print(r.text)
print("<p>",url,"</p>")
