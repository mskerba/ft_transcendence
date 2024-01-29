import * as jwt from 'jsonwebtoken';






interface DecodedToken {
    [key: string]: any;
}

function decodeJwtFromCookies(cookies: string): number | null {
    const parsedCookies = cookies.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
    }, {});

    // Extract the JWT token from the "accessToken" cookie
    const jwtToken = parsedCookies['refreshToken'];

    if (!jwtToken) {
        return null;
    }

    try {
        const decodedToken = jwt.verify(jwtToken, process.env.RT_SECRET) as DecodedToken;
        return decodedToken.sub;
    } catch (error) {
        return null;
    }
}

export default decodeJwtFromCookies;

