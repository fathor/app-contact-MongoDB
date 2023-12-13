const fs = require('fs')

// create folder
const dirPath = './data'
if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath)

// create file
const filePath = './data/contact.json'
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]', 'utf-8')

// mengambil data didalam file
const loadContacts = () => {
    const file = fs.readFileSync('./data/contact.json', 'utf-8')
    const contacts = JSON.parse(file)
    return contacts
}

// menampilkan detail contact
const findContact = (nama) => {
    const contacts = loadContacts()
    const contact = contacts.find((contact) => contact.nama === nama)
    return contact
}

// menimpa file contacts
const saveContacts = (contacts) => {
    fs.writeFileSync('./data/contact.json', JSON.stringify(contacts))

}

// cek duplicate
const cekDuplicate = (nama) => {
    const contacts = loadContacts()
    return contacts.find((contact) => contact.nama === nama)
}

// menambahkan contact
const addContact = (contact) => {
    const contacts = loadContacts()
    contacts.push(contact)
    saveContacts(contacts)
}

//hapus contact
const deleteContact = (nama) => {
    const contacts = loadContacts()
    const newContacts = contacts.filter((contact) => contact.nama !== nama)
    saveContacts(newContacts)
}

const updateContacts = (contactBaru) => {
    const contacts = loadContacts()
    const filteredContacts = contacts.filter((contact) => contact.nama !== contactBaru.oldNama)
    delete contactBaru.oldNama
    filteredContacts.push(contactBaru)
    saveContacts(filteredContacts)
}

module.exports = { loadContacts, findContact, addContact, cekDuplicate, deleteContact, updateContacts }