# API

이러닝 진도확인 API 분석

# 이러닝 영상 종류

학습관리 시스템에 업로드되는 영상은 확인된 바에 의하면 최소 3가지이다.

- `vod`: 보통 그냥 영상. 대부분의 이러닝 강의가 이 형식을 채택함. 브라우저 콘솔에서 track_for_onwindow 함수 실행하여 간단하게 바이패스 가능.
- `econtents`: 웹페이지 내에서 다른 페이지를 프레임으로 호스트하는 형식. 이 또한 `vod`와 같이 바이패스 가능.
- `xncommons`: 인트로 영상이 존재하는 메인 강의 영상의 형상을 취하는 방식. 위의 간단한 방법이 먹히지 않음. 현재 대부분의 온라인 강의가 이 형식을 채택하고 있음.


# 진도 업데이트 방법

## VOD

로그인 필요(= 쿠키에 `MoodleSession` 필요).

http://cyber.inu.ac.kr/mod/vod/action.php에 POST 전송.

헤더:
> X-Requested-With:XMLHttpRequest

x-www-form-urlencoded 파라미터:
> type:vod_track_for_onwindow
track:1152847
state:99 /* 시작:3 업데이트:99  */
position:23
attempts:8
interval:60

### 특이사항

처음 시작할 때에는 state로 3을 지정한다. 이후 업데이트에는 99를 지정한다. 페이지 퇴장 시에도 99로 호출한다. 귀찮아지고 싶지 않다면 처음에는 99가 아닌 3을 **position 0으로** 호출할 것. 3과 함께 넘긴 position이 추후 학습 시간 계산의 base가 됨. 3과 함께 location 1000을 호출했다면, 2000초 학습시간을 주기 위해 99와 함께 3000을 넘겨야 함!


## ECONTENTS

로그인 필요(= 쿠키에 `MoodleSession` 필요).

http://cyber.inu.ac.kr/mod/vod/action.php에 POST 전송.

헤더:
> X-Requested-With:XMLHttpRequest

x-www-form-urlencoded 파라미터:
> type:track_for_onwindow
track:1152847
state:99 /* 시작:3 업데이트:99  */
position:23
attempts:8
interval:60

### 특이사항

vod의 그것과 같다.

> 처음 시작할 때에는 state로 3을 지정한다. 이후 업데이트에는 99를 지정한다. 페이지 퇴장 시에도 99로 호출한다. 귀찮아지고 싶지 않다면 처음에는 99가 아닌 3을 **position 0으로** 호출할 것. 3과 함께 넘긴 position이 추후 학습 시간 계산의 base가 됨. 3과 함께 location 1000을 호출했다면, 2000초 학습시간을 주기 위해 99와 함께 3000을 넘겨야 함!

딱 하나 다르다. `type`이 `track_for_onwindow`이다.

## XNCOMMONS

http://cyber.inu.ac.kr/mod/xncommons/action.php에 POST 전송하는 방법은 **기존의 방법은 통하지 않는다!**

http://cyber.inu.ac.kr/webservice/rest/server.php 여기에다가 보내야 한다.

cyber.inu.ac.kr의 로그인 데이터가 필요 없다(= 쿠키에 `MoodleSession` 필요없음).

대신 인증은 페이로드에 실어 보낸다.

헤더:
> X-Requested-With:XMLHttpRequest

x-www-form-urlencoded 파라미터:

### 시작

> wstoken:60c3d5af47cc8f95fe6e88ebcb854f67
wsfunction:mod_xncommons_init
asskey:VFZSRmVFNUVRVEU9
cmsid:3388
totalpage:0

### 업데이트

> wstoken:60c3d5af47cc8f95fe6e88ebcb854f67
wsfunction:mod_xncommons_track
asskey:VFZSRmVFNUVRVEU9
cmsid:3388
state:8
positionold:1560
positionnew:1560
page:20
totalpage:21

### 종료

> wstoken:60c3d5af47cc8f95fe6e88ebcb854f67
wsfunction:mod_xncommons_track
asskey:VFZSRmVFNUVRVEU9
cmsid:3388
state:99
positionold:2496.62
positionnew:2496.62
page:21
totalpage:21

### 특이사항

종료가 업데이트의 역할도 한다. 하나로 합쳐서 써도 된다.

# 토큰 구하기

## VOD, ECONTENTS

track 번호만 찾으면 된다.

로그인이 필요하다 (`MoodleSession`).

강의 URL이 아래와 같이 주어질 것이다.

- http://cyber.inu.ac.kr/mod/vod/viewer.php?id=blah
- http://cyber.inu.ac.kr/mod/econtents/view.php?id=blah

`view` 부분만 `viewer`로 바꾼다.

바꾼 URL로 GET을 보내어 응답으로 도착한 텍스트 중에 아래와 같은 부분이 존재한다.

`"track" : 67316`

정규식으로 잡자.

`/\"track\" : ([0-9]+)/`

## XNCOMMONS

요 유형의 강의는 이상하게도 `ok.inu.ac.kr`로 이어진다. `cyber.inu.ac.kr`의 `MoodleSession`도 안 쓴다.

찾아야 할 것도 많다.

- wstoken
- asskey
- cmsid

**헐, wstoken은 상수다.**
~~~
var token = '60c3d5af47cc8f95fe6e88ebcb854f67';
~~~

충격적이다.

웹페이지(cyber) 안의 프레임(cyber) 안의 프레임(ok) 주소가 `http://ok.inu.ac.kr/em/5e8ad5b4f11d?content_id=5e8ad5b4f11d&TargetUrl=http://cyber.inu.ac.kr&asskey=VFZSRmVFNUVRVEU9&rskey=60c3d5af47cc8f95fe6e88ebcb854f67&cmsid=3386&startat=1206&endat=1206&pr=1` 이런 형식으로 나가는데, **헐, 저기에 asskey가 있다**. **cmsid도 있다**;;
