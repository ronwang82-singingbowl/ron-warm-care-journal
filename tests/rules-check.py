import base64, json, time, urllib.request, urllib.error
PROJECT='demo-care-journal'
BASE=f'http://127.0.0.1:8789/v1/projects/{PROJECT}/databases/(default)/documents'
def token(uid='owner',email='ronwang82@gmail.com',verified=True,provider='google.com'):
    enc=lambda x:base64.urlsafe_b64encode(json.dumps(x).encode()).decode().rstrip('=')
    return enc({'alg':'none','typ':'JWT'})+'.'+enc({'iss':f'https://securetoken.google.com/{PROJECT}','aud':PROJECT,'sub':uid,'user_id':uid,'iat':int(time.time()),'exp':int(time.time())+3600,'email':email,'email_verified':verified,'firebase':{'sign_in_provider':provider}})+'.'
def call(method,url,data=None,auth=None):
    headers={'Content-Type':'application/json'}
    if auth:headers['Authorization']='Bearer '+auth
    req=urllib.request.Request(url,data=json.dumps(data).encode() if data else None,headers=headers,method=method)
    try:
        with urllib.request.urlopen(req) as r:return r.status,r.read().decode()
    except urllib.error.HTTPError as e:return e.code,e.read().decode()
def write(auth,version=1,content='{"people":[],"records":[],"practices":[]}',uid='owner',extra=None,omit=False):
    fields={'content':{'stringValue':content},'version':{'integerValue':str(version)}}
    if extra:fields.update(extra)
    if omit:del fields['content']
    return call('POST',BASE+':commit',{'writes':[{'update':{'name':f'projects/{PROJECT}/databases/(default)/documents/journals/{uid}','fields':fields},'updateTransforms':[{'fieldPath':'updatedAt','setToServerValue':'REQUEST_TIME'}]}]},auth)
checks=[]
def check(name,result,expected):
    assert result[0]==expected,(name,result)
    checks.append(name)
check('owner creates valid journal',write(token()),200)
check('owner reads journal',call('GET',BASE+'/journals/owner',auth=token()),200)
check('anonymous denied',call('GET',BASE+'/journals/owner'),403)
check('other email denied',call('GET',BASE+'/journals/owner',auth=token(email='other@gmail.com')),403)
check('other uid denied',call('GET',BASE+'/journals/owner',auth=token(uid='other')),403)
check('unverified denied',write(token(verified=False),2),403)
check('password provider denied',write(token(provider='password'),2),403)
check('owner updates valid journal',write(token(),2),200)
check('stale version denied',write(token(),2),403)
check('oversized data denied',write(token(),3,'x'*200001),403)
check('extra fields denied',write(token(),3,extra={'admin':{'booleanValue':True}}),403)
check('missing required field denied',write(token(),3,omit=True),403)
check('wrong content type denied',write(token(),3,extra={'content':{'integerValue':'5'}}),403)
check('cross owner creation denied',write(token(),uid='other'),403)
check('unmatched collection denied',call('PATCH',BASE+'/users/owner',{'fields':{}},token()),403)
check('final valid update',write(token(),3),200)
print(f'{len(checks)} Firestore access and validation checks passed')
