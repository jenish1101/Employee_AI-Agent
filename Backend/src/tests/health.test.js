import {
    describe,
    it,
    expect
} from "vitest";

import request
    from "supertest";

import app
    from "../app.js";

describe(
    "Health API",
    () => {
        it(
            "should return API health",
            async () => {
                const response =
                    await request(
                        app
                    ).get(
                        "/health"
                    );

                expect(
                    response.status
                ).toBe(200);

                expect(
                    response.body
                        .success
                ).toBe(true);
            }
        );
    }
);