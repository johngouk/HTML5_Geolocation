#!/usr/bin/python3
# -*- coding: UTF-8 -*-# enable debugging
# Simple script to forward received URL requests to the encoded URL
# and return the JSON results to the user
import cgi
import cgitb
import json
import requests
cgitb.enable(display=0, logdir="/var/log/apache2")
form = cgi.FieldStorage()
# Need some checking to see the proposed URL is well-formed etc.
#if "url" not in form:
    
url = form["url"].value
headers = {'Accept':'application/json'}
r = requests.get(url, headers=headers)
if r.status_code == requests.codes.ok:
    print("Status: 200")
    print("Content-Type: application/json;charset=utf-8")
    print()
    print(r.text)
else:
    print("Status: "+str(r.status_code)+" "+r.reason)
    print("Content-Type: text/html;charset=utf-8")
    print()
    print("<p>Error "+str(r.status_code)+" "+r.reason+" accessing<br>",url,"</p>")
