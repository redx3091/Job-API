const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/index.error');

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};
const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobid },
  } = req;

  const job = await Job.findOne({
    _id: jobid,
    createdBy: userId,
  });

  if (!job) {
    throw new NotFoundError(`No job with ${jobid}`);
  }
  res.status(StatusCodes.OK).json({ job });
};
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};
const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobid },
  } = req;

  if (company === '' || position === '') {
    throw new BadRequestError(`Company or position fields cannot be empty`);
  }

  const job = await Job.findByIdAndUpdate({
    _id: jobid,
    createdBy: userId
  },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError(`No job with ${jobid}`);
  }
  res.status(StatusCodes.OK).json({ job });
};
const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobid },
  } = req;

  const job = await Job.findByIdAndRemove({
    _id: jobid,
    createdBy: userId
  });
  if (!job) {
    throw new NotFoundError(`No job with ${jobid}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};

//! 8:37:38
