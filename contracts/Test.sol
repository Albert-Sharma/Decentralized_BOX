// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


//Structure are user defined data types that can be used to group items of possibly different data types into a single type
struct FileData {
    string fileURL;
    string fileName;
    address fileOwner;
    string ownerName;
}

//contract is container where we write our code.
//Each contract have it's own address.
//if we have contract address and abi we can iteract with it
contract Test {
    address public owner;
    uint public count;
    
    // This is a dynamic sized array
    FileData[] FileArray;


 //event facilitate communication between smart contracts and their user interfaces.
 //When an event is emitted
 //User Gets Notifications
//Owner of Smart contract also gets Notification
    event FileUploaded(
        string fileURL,
        string fileName,
        address fileOwner,
        string ownerName
    );
//Constructor are special type of functions which get executed only once when we create our smart contract
//we use constructor whenever we want to initialise our state variable or we want to decide the order of the contract
    constructor(){
        count=0;
        owner = msg.sender;
    }

    function addFile(string memory _fileURL, string memory _fileName, address _fileOwner, string memory _ownerName) public payable{
        FileArray.push(FileData(_fileURL, _fileName, _fileOwner, _ownerName));
        emit FileUploaded(_fileURL, _fileName, _fileOwner, _ownerName);
        count++;
    }

    function getData(uint x) public view returns(FileData memory){
        return FileArray[x];
    }

    function getCount() public view returns(uint){
        return count;
    }
}
