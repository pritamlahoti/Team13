const mentorService = require('./mentor.service');
const { formatSuccessResponse } = require('../admin/admin.utils');

const listStudents = async (req, res, next) => {
  try {
    const students = await mentorService.listStudents(req.user.id);
    res.json(formatSuccessResponse(students));
  } catch (err) {
    next(err);
  }
};

const getStudent = async (req, res, next) => {
  try {
    const student = await mentorService.getStudent(req.user.id, req.params.studentId);
    res.json(formatSuccessResponse(student));
  } catch (err) {
    next(err);
  }
};

const listStudentSubmissions = async (req, res, next) => {
  try {
    const submissions = await mentorService.listStudentSubmissions(
      req.user.id,
      req.params.studentId
    );
    res.json(formatSuccessResponse(submissions));
  } catch (err) {
    next(err);
  }
};

module.exports = { listStudents, getStudent, listStudentSubmissions };
