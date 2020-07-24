const express = require('express');
const router = express.Router();
const {Performer} = require('../../models');

/* GET index */
router.get('/', async function (req, res) {
  const performers = await req.user.getPerformers({
    attributes: ['id', 'name', 'email', 'location', 'rating'],
    order: [['id', 'ASC']],
  });
  res.send(performers);
});

/* GET active */
router.get('/active', async function (req, res) {
  const performers = await req.user.getPerformers({
    attributes: ['id', 'name'],
    order: [['id', 'ASC']],
    where: {active: true},
  });
  res.send(performers);
});

/* GET show */
router.get('/:id', async function (req, res) {
  const performer = await Performer.basicFind(req.params.id, req.user.id);
  if (performer) {
    res.send(performer);
  } else {
    res.status(404).send({error: 'Performer not found.'});
  }
});

/* PATCH update */
router.patch('/:id', async function (req, res) {
  const performer = await Performer.basicFind(req.params.id, req.user.id);
  if (!performer) {
    res.status(404).send({error: 'Performer not found.'});
    return;
  }
  try {
    await performer.update(
      ({name, email, location, phone, details, website, active} = req.body),
    );
    res.send(performer);
  } catch (e) {
    res.status(500).send({error: 'Cannot update performer.'});
  }
});

/* POST create */
router.post('/', async function (req, res) {
  try {
    const performer = await req.user.createPerformer(
      ({name, email, location, phone, details, website, active} = req.body),
    );
    res.send(performer);
  } catch (e) {
    res.status(500).send({error: 'Error creating a performer.'});
  }
});

module.exports = router;
