import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';

import LoginBackground from '../components/Login/LoginBackground';
import LoginForm from '../components/Login/LoginForm';
import {TalkClient} from 'node-kakao/dist';

// @ts-ignore
const talkClient: TalkClient = nw.global.talkClient;

const errorReason: string[] = [];
errorReason[-9797] = "서버 점검 중";
errorReason[-999] = "클라이언트 버전이 너무 낮음";
errorReason[-998] = "인증이 필요함";
errorReason[-997] = "계정이 차단됨";
errorReason[-500] = "알 수 없는 실패";
errorReason[-402] = "차단된 친구에게 메시지 전송 시도";
errorReason[-401] = "채팅을 찾을 수 없음";
errorReason[-301] = "INTERNAL_SERVER_ERROR_BO";
errorReason[-300] = "INTERNAL_SERVER_ERROR_CARRIAGE";
errorReason[-203] = "올바르지 않은 Parameter";
errorReason[-202] = "올바르지 않은 Method";
errorReason[-201] = "로그아웃된 계정으로부터 요청 발생";
errorReason[-112] = "인증을 너무 많이 요청함";
errorReason[-111] = "인증 번호가 틀림";
errorReason[-102] = "인증 가능한 기기 개수 초과";
errorReason[-101] = "다른 클라이언트가 로그인 중";
errorReason[-100] = "등록되지 않은 디바이스";
errorReason[-1] = "올바르지 않은 사용자";
errorReason[30] = "일부 필드 값이 잘못됨";
errorReason[32] = "카카오톡 계정을 찾을 수 없음";
errorReason[500] = "Internal Error";

const Login = () => {
    const [redirect, setRedirect] = useState('');

    const onSubmit = (email: string, password: string, force: boolean = false) => {
        // @ts-ignore
        nw.global.getUUID()
            .then((uuid: string) => {
                talkClient.login(email, password, uuid, force)
                    .then(r => {
                        alert('로그인 성공');
                        setRedirect('chat');
                    })
                    .catch(reason => {
                        switch (reason) {
                            case -100: // 인증이 필요
                                // @ts-ignore
                                nw.global.email = email;
                                // @ts-ignore
                                nw.global.password = password;
                                setRedirect('verify');
                                break;
                            case -101:
                                let result = window.confirm('이미 다른 기기에 접속되어 있습니다.\n다른 기기의 연결을 해제하시겠습니까?');
                                if (result) {
                                    onSubmit(email, password, true);
                                }
                                break;
                            case 12:
                                let cause = reason.message;
                                if (cause) {
                                    alert(cause);
                                } else {
                                    alert('오류가 발생했습니다. 오류 코드: -12');
                                }
                                break;
                            default:
                                if (errorReason[reason] !== undefined) {
                                    alert(errorReason[reason]);
                                } else {
                                    alert(`알 수 없는 오류가 발생했습니다. 오류 코드: ${reason}`);
                                }
                                break;
                        }
                    });
            });
    };

  return redirect ? <Redirect to={redirect}/> : (
    <LoginBackground>
      <LoginForm onSubmit={onSubmit}/>
    </LoginBackground>
  )
};

export default Login;
