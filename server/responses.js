module.exports = {
  check(res, error) {
    if (error) {
      res.status(400)
      .json({
        ok: false,
        error
      })
      return false;
    }
    else {
      return true;
    }
  }
}
