import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler
} from "@angular/common/http";
import { Injectable } from "@angular/core";

import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const user = this.authService.getUser();
        if (user) {
            if (user.expirationDate.getTime() - Date.now() > 0) {
                console.log("not expired");
                const authToken = user.token;
                const authRequest = req.clone({
                    headers: req.headers.set("Authorization", authToken)
                });
                console.log("Attached headers to request");
                return next.handle(authRequest);
            }
            else {
                console.log("Didn't attach headers! Token expired");
                this.authService.loguot();
                return next.handle(req);
            }

        }
        else {
            console.log("Didn't attach headers! Token not found ");
            return next.handle(req);
        }
    }
}
