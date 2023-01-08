import nodemailer from "nodemailer";

const sendEmailAccuseInfoToOperator = (
  which: string,
  id: number,
  numberOfAccused: number,
  reason: string,
  detail: string,
  whoSend: string,
) => {

  try {
    const reasons = [
      "성적인 내용",
      "혐오스러운 내용",
      "사기, 거짓 정보",
      "지식 재산권 침해",
      "과도한 홍보성 내용",
      "기타"
    ];

    const html = `<div style="font-size:16px;">
        ${whoSend} 님의 ${which} 게시물 신고 
      </div>
      <div style="font-size:13px;">
        게시물 id : ${id}
        누적 신고수 : ${numberOfAccused}
        reason : ${reasons[reason]}
      </div>
      <div style="font-size:13px;">
        detail : ${detail}
      </div>`;

    const transporter = nodemailer.createTransport({ 
      // SES: { ses, aws },
      service: 'Naver',
      host: 'smtp.naver.com',
      port: 587,
      auth: {
        user: process.env.NAVER_ID,
        pass: process.env.NAVER_PASSWORD,
      }
    });
      // send mail
    transporter.sendMail(
      {
        from: process.env.NAVER_ID,
        to: process.env.NAVER_ID,
        subject: `[쏘큐티] ${whoSend} 님의 ${which} 게시물 신고 메일`,
        html,
      },
      (err, info) => {
        if (err) {
          console.error("이메일 전송 에러 : " + err);
        }
        if(info) {
          console.log("이메일 전송 info : " + info);
        }
      }
    );
  } catch (e) {
    console.error("sendEmailAccuseInfoToOperator 에러 : " + e);
  }
};

export default sendEmailAccuseInfoToOperator;