var express = require('express');
var router = express.Router();

router.get('/cal', function(req, res, next) {
  res.json(['2015-05-23', '2015-05-22', '2015-05-21']);
});

router.get('/news', function(req, res) {
  res.json({
    feeds: [
      {
        content: '헬스 휘트니스 옷장과 화장대 내 무단 보관된 사물은 내일 폐기합니다.',
        date: '2015-05-18'
      },
      {
        content: '기간 연장은 입원치료등 서류 제출시 가능하며, 여행등은 해당되지 않습니다.',
        date: '2015-05-15'
      },
      {
        content: '회원들께서는 휘트니스 이용수칙을 잘 지켜주시기 바랍니다. 감사합니다.',
        date: '2015-05-08'
      },
      {
        content: '재등록하셔서 다시 운동하는 모습으로 뵙기를 바랍니다. ^^',
        date: '2015-05-04'
      }
    ]
  });
});

module.exports = router;
