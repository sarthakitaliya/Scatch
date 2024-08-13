class ExpressError extends Error{
    constructor(status=500, message = "Something went wrong"){
        super(); 
        this.status = status;
        this.message = message;
    }
}

module.exports = ExpressError;