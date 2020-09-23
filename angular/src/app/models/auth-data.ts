
export class AuthData {
    constructor(
        public id: number,
        public type: string,
        public expirationDate: Date,
        public token: string,
        ) { }
}

