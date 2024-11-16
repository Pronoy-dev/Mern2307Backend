class apiResponse {
  constructor(statusCode, messsage, data, error) {
    this.statusCode = statusCode;
    this.messsage = messsage;
    this.data = data;
    this.error = error;
  }
}

module.exports = { apiResponse };
