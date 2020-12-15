export interface User {
    ime: string;
    prezime: string;
    email: string;
    hash: string;
    token?: string;
    id?: string;
    link?: string;
    datumRegistracije?: Date
}
