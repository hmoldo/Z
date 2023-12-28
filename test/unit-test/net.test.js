// @vitest-environment jsdom
import { expect, describe, test, afterAll, afterEach, beforeAll } from "vitest";
import * as NET from "/src/NET";
import { HttpResponse, graphql, http } from "msw";
import { setupServer } from "msw/node";

const post = {
  userId: 1,
  id: 1,
  title: "first post title",
  body: "first post body",
};

export const restHandlers = [
  http.get("https://my-api.test", () => {
    return HttpResponse.json(post);
  }),
];
const server = setupServer(...restHandlers);

document.body.innerHTML = `
<div>
    <img id="Img1" data-src="dataSrc" data-srcset="dataSrcSet" >
    <img id="Img2" data-src="dataSrc" >
    <img id="Img3" data-srcset="dataSrcSet" >
    <div id="Lazy">
        <img class="lazy" data-src="dataSrc" data-srcset="dataSrcSet" >
        <iframe class="lazy" data-src="frameSrc"></iframe>
        <img class="lazy" data-src="dataSrc" >
        <div class="lazy" data-src="bgSrc"></div>
        <img class="lazy" data-srcset="dataSrcSet" data-lazy-onload="AppStopResize">
        <div class="masthead__image loading">
            <picture>
                <source type="image/webp" sizes="100vw" data-srcset="srcA720.webp 720w, srcA1280.webp 1280w, srcA1920.webp 1920w, srcA2880.webp 2880w">
                <source type="image/jpeg" sizes="100vw" data-srcset="srcB720.jpg 720w, srcB1280.jpg 1280w, srcB1920.jpg 1920w, srcB2880.jpg 2880w">
                <img class="lazy object-fit-cover masthead__image--background" width="3200" height="1800">
            </picture>
            <img class="blur masthead__image--background background__image--blur" src="srcBlur.jpg">
        </div>
    </div>
</div>
`;

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());

test("fetch", async () => {
  const { resp, body, auth } = await NET.load({
    url: "https://my-api.test",
  });

  expect(body).toEqual(post);
});
