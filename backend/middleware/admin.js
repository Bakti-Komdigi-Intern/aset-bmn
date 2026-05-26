const adminMiddleware =
  (req, res, next) => {

    try {

      // =========================
      // CHECK LOGIN
      // =========================

      if (!req.user) {

        return res.status(401).json({
          message:
            "Unauthorized"
        });
      }

      // =========================
      // CHECK ROLE
      // =========================

      if (
        req.user.role !==
        "admin"
      ) {

        return res.status(403).json({
          message:
            "Akses admin only"
        });
      }

      next();

    } catch (err) {

      console.log(
        "ADMIN MIDDLEWARE ERROR:",
        err
      );

      return res.status(500).json({
        message:
          "Server error"
      });
    }
  };

module.exports =
  adminMiddleware;