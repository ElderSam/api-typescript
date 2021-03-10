interface UserReturn {
    id: string,
    name: string,
    email: string,
    password?: string, // the password can be `undefined`

    idade?: string,
    peso?: string,
    etnia?: string
}

interface UserToInsert {
    name: string,
    email: string,
    password: string,

    idade: string,
    peso: string,
    etnia: string
}

export {
    UserReturn,
    UserToInsert
};