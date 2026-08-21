const teamsRepo = require('./teams.repo');

const createTeam = (name) => teamsRepo.create(name);

const addMember = (teamId, userId) => teamsRepo.addMember(teamId, userId);

const getTeam = (id) => teamsRepo.findById(id);

module.exports = { createTeam, addMember, getTeam };
