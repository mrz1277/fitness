var express = require('express');
var router = express.Router();

var UserActivity = require('../models/UserActivity');
var moment = require('moment');
var util = require('util');

router.get('/cal', function(req, res, next) {
  var dummy = ['2015-06-01', '2015-06-02', '2015-06-05', '2015-06-08', '2015-06-15'];

  UserActivity.find().lean().exec(function(err, result) {
    if (err) res.status(500).json(err);
    else {
      result.forEach(function(activity) {
        dummy.push(moment(activity.datetime).format('YYYY-MM-DD'));
      });
      res.json(dummy);
    }
  });
});

router.get('/news', function(req, res) {
  res.json([
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
    ]);
});

router.get('/profile', function(req, res) {
  res.json({
    name: '구재성',
    image: '/images/flat-avatar.png'
  })
});

router.get('/today', function(req, res) {
  var dummy = {
    time: 50,
    timeBase: 60,
    distance: 4,
    distanceBase: 5,
    calory: 1000,
    caloryBase: 1500,
    goal: 'distance'
  };

  UserActivity.find({ datetime: { $gt: moment().startOf('d').toDate() } }, function(err, activities) {
    if (err) res.status(500).json(err);
    else {
      activities.forEach(function(activity) {
        dummy.time += activity.time;
        dummy.distance += activity.distance;
        dummy.calory += activity.calory;
      });

      res.json(dummy);
    }
  });
});

router.get('/activity', function(req, res) {
  res.json([
      {
        name: 'Walking / Running',
        type: 'aerobic',
        id: 0
      },
      {
        name: 'Biking',
        type: 'aerobic',
        id: 1
      },
      {
        name: 'Aerobics',
        type: 'aerobic',
        id: 2
      },
      {
        name: 'Yoga',
        type: 'aerobic',
        id: 3
      }
    ]);
});

router.get('/body', function(req, res) {
  res.json([
      {
        name: 'Weight',
        unit: 'kg',
        id: 0
      },
      {
        name: 'Lean Body Mass',
        unit: 'kg',
        id: 1
      },
      {
        name: 'Body Fat Percent',
        unit: '%',
        id: 2
      },
      {
        name: 'Body Mass Index',
        unit: 'BMI',
        id: 3
      },
      {
        name: 'Height',
        unit: 'cm',
        id: 4
      }
    ]);
});

// date must be sorted by ascending
router.get('/activity/data', function(req, res) {
  var dummy = [
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
  ];

  var query = UserActivity.find();
  query.sort('datetime');
  query.exec(function(err, activities) {
    if (err) res.status(500).json(err);
    else {
      activities.forEach(function(activityModel) {
        var activity = activityModel.toJSON();
        activity.date = moment(activity.datetime).format('YYYY-MM-DD');
        dummy.push(activity);
      });
      res.json(dummy);
    }
  });
});

router.get('/body/data', function(req, res) {
  res.json([
    {
      date: '2015-06-01',
      body_id: 4,
      value: 161
    },
    {
      date: '2015-06-02',
      body_id: 4,
      value: 162
    },
    {
      date: '2015-06-15',
      body_id: 4,
      value: 163
    },
    {
      date: '2015-06-01',
      body_id: 0,
      value: 60
    },
    {
      date: '2015-06-02',
      body_id: 0,
      value: 59
    },
    {
      date: '2015-06-03',
      body_id: 0,
      value: 61
    },
    {
      date: '2015-06-04',
      body_id: 0,
      value: 63
    }
  ]);
});

router.post('/activity', function(req, res) {
  // TODO validate request data
  // TODO check if duplicate

  req.body.datetime = moment(req.body.datetime).toDate();

  new UserActivity(req.body).save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = router;
