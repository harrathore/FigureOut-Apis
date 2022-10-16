const express = require('express');
const router = express.Router();

const {myGroups, createGroup, addMember, removerMember, addExpense, calculate} = require('../Controllers/GroupController')

router.get('/mygroups', myGroups);

router.post('/createGroup', createGroup);

router.post('/addMember', addMember);

router.post('/removeMember', removerMember);

router.post('/addExpense', addExpense);

router.get('/calculate', calculate);


module.exports = router;