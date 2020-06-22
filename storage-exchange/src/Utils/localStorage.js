import { USERTYPES } from './config';

export function getToken() {
    return localStorage.getItem('accessKey');
}

export function getUserType() {
    let role = localStorage.getItem('role');
    var usertype = "";
    switch (role) {
        case 'Buyer':
            usertype = USERTYPES.Buyer;
            break;
        case 'Seller':
            usertype = USERTYPES.Seller;
            break;
        case 'Admin':
            usertype = USERTYPES.Admin
            break;
    }
    return usertype;
}

export function getName() {
    return localStorage.getItem('name');
}

export function getbuyerStoreIDs() {
    return localStorage.getItem('buyerStoreIDs');
}