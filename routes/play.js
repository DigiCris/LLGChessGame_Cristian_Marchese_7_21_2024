var express = require('express');
var util = require('../config/util.js');
var web3 = require('../config/web3.js');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('partials/play', {
        title: 'Chess Hub - Game',
        user: req.user,
        isPlayPage: true
    });
});

router.post('/', function(req, res) {
    var side = req.body.side;
    //var opponent = req.body.opponent; // playing against the machine in not implemented
    var token = util.randomString(20);
    res.redirect('/game/' + token + '/' + side);
});

////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// Here starts my API implementation ////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

/**
 * @api {get} /allowance/:owner/:spender Get Allowance
 * @apiName GetAllowance
 * @apiGroup Allowance
 *
 * @apiParam {String} owner The Ethereum address of the owner of the tokens.
 * @apiParam {String} spender The Ethereum address of the spender of the tokens.
 *
 * @apiSuccess {String} owner The Ethereum address of the owner of the tokens.
 * @apiSuccess {String} spender The Ethereum address of the spender of the tokens.
 * @apiSuccess {Number} allowance The amount of tokens that the spender is allowed to spend on behalf of the owner.
 * @apiSuccess {String} message A success message indicating that the allowance was fetched successfully.
 *
 * @apiError {String} error An error message indicating that the owner or spender address is invalid, or that there was an error fetching the allowance.
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:8050/allowance/0x06Eb67071a06E676b678F5dd3614D852C129d460/0xA6Eb67071a06E676b678F5dd3614D852C129d460
 *
 * @apiSuccessExample {json} Success response:
 *     HTTP/1.1 200 OK
 *     {
 *         "owner": "0x06Eb67071a06E676b678F5dd3614D852C129d460",
 *         "spender": "0xA6Eb67071a06E676b678F5dd3614D852C129d460",
 *         "allowance": 1000,
 *         "message": "Allowance fetched successfully"
 *     }
 *
 * @apiErrorExample {json} Error response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Invalid owner address"
 *     }
 */
router.get('/GetAllowance/:owner/:spender', async function(req, res) {
    // getting params from the url
    const owner = req.params.owner;
    const spender = req.params.spender;

    // sanity checks
    if (!web3.isValidAddress(owner)) {
        return res.status(400).json({
            error: 'Invalid owner address'
        });
    }
    if (!web3.isValidAddress(spender)) {
        return res.status(400).json({
            error: 'Invalid spender address'
        });
    }

    // Getting response, consol.log it and sending it back with http status
    try {
        //trying to get the allowance
        const allowance = await web3.allowanceOf(owner, spender);
        //building response with the allowance result if everything went well
        const response = {
            owner,
            spender,
            allowance,
            message: 'Allowance fetched successfully'
        };
        // loging response
        console.log(response);
        //sending response with http status
        res.status(200).json(response);
    } catch (error) {
        //loging response when error
        console.error('Error fetching allowance:', error);
        //sending error response with http status
        res.status(500).json({
            error: 'Error fetching allowance'
        });
    }
});

/**
 * @api {get} /GetBalance/:address Fetch the balance of an Ethereum address
 * @apiName GetBalance
 * @apiGroup Balance
 *
 * @apiParam {String} address Ethereum address to fetch the balance for.
 *
 * @apiSuccess {String} address Ethereum address.
 * @apiSuccess {String} balance Balance of the Ethereum address.
 * @apiSuccess {String} message A success message.
 *
 * @apiError {String} error An error message in case of an invalid address.
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:8050/GetBalance/0x06Eb67071a06E676b678F5dd3614D852C129d460
 *
 * @apiSuccessExample {json} Success response:
 *     HTTP/1.1 200 OK
 *      {
 *          "address": "0x06Eb67071a06E676b678F5dd3614D852C129d460",
 *          "balance": 900,
 *          "message": "Balance fetched successfully"
 *      }
 *
 * @apiErrorExample {json} Error response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Invalid address"
 *     }
 */
router.get('/GetBalance/:address', async function(req, res) {
    const address = req.params.address;

    if (!web3.isValidAddress(address)) {
        return res.status(400).json({
            error: 'Invalid address'
        });
    }

    try {
        const balance = await web3.balanceOf(address);
        const response = {
            address,
            balance,
            message: 'Balance fetched successfully'
        };
        console.log(response);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching Balance:', error);
        res.status(500).json({
            error: 'Error fetching Balance'
        });
    }
});

/**
 * @api {post} /SetApprove Approve Tokens
 * @apiName SetApprove
 * @apiGroup Allowance
 *
 * @apiParam {String} spender The Ethereum address of the spender being approved.
 * @apiParam {Number} value The amount of tokens approved to the spender.
 * @apiParam {Password} Password to generate deterministic account for user.
 *
 * @apiSuccess {String} spender Address of the spender approved.
 * @apiSuccess {Number} value Amount of tokens approved to the spender.
 * @apiSuccess {String} message A success message indicating a successfull approval.
 *
 * @apiError {String} error Error message indicating: spender address is invalid, the value is invalid, or an error approving the tokens.
 *
 * @apiExample {curl} Example usage:
 *     curl -X POST -H "Content-Type: application/json" -d '{"spender":"0x06Eb67071a06E676b678F5dd3614D852C129d460","value":1000}' http://localhost:8050/SetApprove
 *
 * @apiSuccessExample {json} Success response:
 *     HTTP/1.1 200 OK
 *     {
 *         "spender": "0x06Eb67071a06E676b678F5dd3614D852C129d460",
 *         "value": 1000,
 *         "message": "Approval success"
 *     }
 *
 * @apiErrorExample {json} Error response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Invalid spender address"
 *     }
 */
router.post('/SetApprove', async function(req, res) {
    const { spender, value, password } = req.body;

    // Saninity checks
    if (!web3.isValidAddress(spender)) {
        return res.status(400).json({
            error: 'Invalid spender address'
        });
    }
    if (!web3.isValidValue(value)) {
        return res.status(400).json({
            error: 'Invalid value'
        });
    }

    // Getting approving and informing result in console.lo and to the user. Also adding http status
    try {
        //trying to do the aprove
        await web3.approve(spender, value, password);
        //building response informing the approve action
        const response = {
            spender,
            value,
            message: 'Approval success'
        };
        // console login the action if it went well
        console.error(response);
        // sending the response to user with the http status code
        res.status(200).json(response);
    } catch (error) {
        // console loging any error
        console.error('Error approving:', error);
        // responding with the error status to inform the API user
        res.status(500).json({
            error: 'Error approving'
        });
    }
});

////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// Ending my API Implementation //// ////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;