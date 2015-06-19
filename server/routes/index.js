var express = require('express');
var router = express.Router();

router.get('/cal', function(req, res, next) {
  res.json(['2015-06-02', '2015-06-04', '2015-06-09']);
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

router.get('/profile', function(req, res) {
  res.json({
    name: '구재성',
    image: '/images/flat-avatar.png'
  })
});

router.get('/today', function(req, res) {
  res.json({
    time: 50,
    timeBase: 60,
    distance: 4,
    distanceBase: 5,
    calory: 1000,
    caloryBase: 1500,
    goal: 'distance'
  });
});

router.get('/activity', function(req, res) {
  res.json({
    activities: [
      {
        name: 'Walking / Running'
      },
      {
        name: 'Biking'
      },
      {
        name: 'Aerobics'
      },
      {
        name: 'Yoga'
      }
    ]
  });
});

router.get('/body', function(req, res) {
  res.json([
      {
        name: 'Height',
        unit: 'cm',
        id: 0
      },
      {
        name: 'Weight',
        unit: 'kg',
        id: 1
      },
      {
        name: 'Lean Body Mass',
        unit: 'kg',
        id: 2
      },
      {
        name: 'Body Fat Percent',
        unit: '%',
        id: 3
      },
      {
        name: 'Body Mass Index',
        unit: 'BMI',
        id: 4
      }
    ]);
});

// date must be sorted by ascending
router.get('/activity/data', function(req, res) {
  res.json([
    {
      date: '2015-06-01',
      activity_id: 0,
      distance: 5,
      time: 40,
      calory: 1000
    },
    {
      date: '2015-06-01',
      activity_id: 1,
      distance: 5,
      time: 20,
      calory: 500
    },
    {
      date: '2015-06-01',
      activity_id: 0,
      distance: 2,
      time: 10,
      calory: 200
    },
    {
      date: '2015-06-02',
      activity_id: 0,
      distance: 3,
      time: 20,
      calory: 400
    },
    {
      date: '2015-06-02',
      activity_id: 3,
      distance: 2,
      time: 10,
      calory: 300
    },
    {
      date: '2015-06-05',
      activity_id: 3,
      distance: 6,
      time: 10,
      calory: 300
    },
    {
      date: '2015-06-08',
      activity_id: 2,
      distance: 1,
      time: 3,
      calory: 120
    },
    {
      date: '2015-06-15',
      activity_id: 0,
      distance: 15,
      time: 50,
      calory: 1000
    }
  ]);
});

router.get('/body/data', function(req, res) {
  res.json([
    {
      date: '2015-06-01',
      body_id: 0,
      value: 161
    },
    {
      date: '2015-06-02',
      body_id: 0,
      value: 162
    },
    {
      date: '2015-06-15',
      body_id: 0,
      value: 163
    },
    {
      date: '2015-06-01',
      body_id: 1,
      value: 60
    },
    {
      date: '2015-06-02',
      body_id: 1,
      value: 59
    },
    {
      date: '2015-06-03',
      body_id: 1,
      value: 61
    },
    {
      date: '2015-06-04',
      body_id: 1,
      value: 63
    }
  ]);
});

module.exports = router;
