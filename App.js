// The object 'Contracts" will be injected here which contains the ABI, address of your deployed contract and endpoint 
var Contracts = { HouseRegistrationContract:  {
    abi: [
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "balances",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_houseNo",
                    "type": "uint256"
                }
            ],
            "name": "getOwner",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "houseNo",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "ownerName",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "walletAddress",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "houseCount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "receiver",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "mintCoins",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_owner",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "_address",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "registerNewHouse",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "receiver",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "sendCoins",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_houseNo",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_owner",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "_address",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "transferHouse",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ],

    address: "0x87dc50fdd50f68f2abb79392bbc5f653519ab3c2",
    endpoint: "https://ropsten.infura.io/v3/undefined"
   }}

   function HouseRegistrationApp(Contract) {
    this.web3 = null;
    this.instance = null;
    this.Contract = Contract;
}
HouseRegistrationApp.prototype.onReady = function() {
    this.init(function () {
        $('#message').append("DApp loaded successfully.");
    });
    this.bindButtons(); //bind the button to their respective functions
    this.loadHouseRegistration(); // call the loadHouseRegistration func to display the house registration list
}

HouseRegistrationApp.prototype.init = function(cb) {
        // enable and connect to MetaMask
        if (window.ethereum) {
            this.web3 = new Web3(ethereum);
        try {
            ethereum.enable();
        } catch (error) {
        }
         }  
    
        // Create the contract interface using the ABI provided in the configuration.
        var contract_interface = this.web3.eth.contract(this.Contract.abi);
    
        // Create the contract instance for the specific address provided in the configuration.
        this.instance = contract_interface.at(this.Contract.address);
    
        cb();
    }

if(typeof(Contracts) === "undefined") var Contracts={ HouseRegistrationContract: { abi: [] }};
var houseRegistrationApp = new HouseRegistrationApp(Contracts['HouseRegistrationContract']);

$(document).ready(function() {
    houseRegistrationApp.onReady();
});

//Calls the houseCount function in the smart contract
HouseRegistrationApp.prototype.getHouseCount = function (cb) {
    this.instance.houseCount(function (error, houseCount) {
        cb(error, houseCount);
    });
};

// Calls the houseList function in the smart contract
HouseRegistrationApp.prototype.getOwner = function (houseNo, cb) {
    this.instance.getOwner(houseNo, function (error, house) {
        cb(error, house);
    });
};

// Gets the number of houses. Using a for loop, iterate through the list to get each house. 
//Bind the house details (house number and owner) to the #houseListResults object in app.html
HouseRegistrationApp.prototype.loadHouseRegistration = function () {
    var that = this;

    this.getHouseCount(function (error, houseCount) {
        if (error) {
            console.log(error)
        }
        $("#message").text("House Count: " + houseCount);
        $("#houseListResults").empty(); //empty the house registration list table
        for (let i = 1; i <= houseCount; i++) {
            var houseNo = i;
            that.getOwner(houseNo, function (error, house) {
                if (error) {
                    console.log(error)
                }
                var number = house[0];
                var owner = house[1];
                var wallet = house[2];
                var houseTemplate = "<tr><td>" + number + "</td><td>" + owner + "</td></tr>" 
                $("#houseListResults").append(houseTemplate);
            });
        }

        var nextHouseCount = houseCount.toNumber() + 1; //find the next number
        $("#newHouseNo").val(nextHouseCount) //set the value of the next houseNo in the house Number textbox
        $("#newHouseNo").attr('disabled', true) //disable entry in the house Number textbox
    });
}


HouseRegistrationApp.prototype.bindButtons = function(){
    var that = this;

    $(document).on("click", "#button-register", function(){
        that.registerNewHouse(); //call the registerNewHouse function when the button-register is clicked
    });
    $(document).on("click", "#button-transfer", function(){
        that.transferHouse(); // call the transferHouse function when the button-transfer is clicked
    });
    $(document).on("click", "#button-balance", function(){
        that.showAddressBalance(); // call the showAddressBalance function when the button-balance is clicked
    });
}


HouseRegistrationApp.prototype.registerNewHouse = function(){
    // Get input for house number and owner
    var newHouseNo = $("#newHouseNo").val();
    var newOwner = $("#newOwner").val();
    var newAddress = $("#newAddress").val();
    var newAmount = $("#newAmount").val();
    $("#message").text("Registering " + newHouseNo + " to " + newOwner);

    this.instance.registerNewHouse(newOwner, newAddress, newAmount,
        //gas required to execute the transaction
        { from: this.web3.eth.accounts[0], gas: 1000000, gasPrice: 1000000000, gasLimit: 1000000 },
        function(){
            if(error){
                console.log(error);
            }
            else{
                if (receipt.status == 1){
                    $("#newHouseNo").val("");
                    $("#newOwner").val("");
                    $("#newAddress").val("");
                    $("#newAmount").val("");
                    that.loadHouseRegistration();
                }
                else{
                    $("#message").text("Registration Failed");
                }
            }
        }
        
    )
}

HouseRegistrationApp.prototype.transferHouse = function(){
    // get input values for address and amount
    var txfHouseNo = $("#txfHouseNo").val();
    var txfOwner = $("#txfOwner").val();
    var txfAddress = $("#txfAddress").val();
    var txfAmount = $("#txfAmount").val();
    $("#message").text("Transfering " + txfHouseNo + " to " + txfOwner);

    this.instance.transferHouse(txfHouseNo, txfOwner, txfAddress, txfAmount,
        // gas required to execure the transcation
        { from: this.web3.eth.accounts[0], gas: 1000000, gasPrice: 1000000000, gasLimit: 1000000},
        function(){
            if(error){
                console.log(error);
            }
            else{
                if(receipt.status == 1) {
                    $("#txfHouseNo").val("");
                    $("#txfOwner").val("");
                    $("#txfAddress").val("");
                    $("#txfAmount").val("");
                    that.loadHouseRegistration();
                }
                else{
                    $("#message").text("Transfer Failed");
                }
            }
        })
}

HouseRegistrationApp.prototype.getBalance = function(address, cb){
    this.instance.balances(address, function(error, result){
        cb(error, result)
    })
}

HouseRegistrationApp.prototype.showAddressBalance = function(hash, cb){

    var address = $("#walletAddress").val();

    this.getBalance(address, function(error, balance){
        if(error){
            console.log(error)
        }
        $("#showbalance").text("Wallet Balance: " + balance.toNumber());
    })
}