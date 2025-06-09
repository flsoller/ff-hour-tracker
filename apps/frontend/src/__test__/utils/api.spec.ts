import { describe, expect, it, vi } from "vitest";
import api from "../../utils/api";

describe("api module", () => {
  describe("api.get", () => {
    it("should correctly return the message body", async () => {
      const testEndpoint = "apioktest";
      const fetchSpy = vi.spyOn(window, "fetch");
      const apiGetSpy = vi.spyOn(api, "get");
      const res = await api.get(testEndpoint);
      expect(res).toStrictEqual([{ key: "value" }, null]);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(apiGetSpy).toHaveBeenCalledWith(testEndpoint);
      expect(fetchSpy).toHaveBeenCalledWith("http://api:5000/api/apioktest", {
        method: "GET",
      });
    });

    it("should correctly return an error message", async () => {
      const testEndpoint = "apierrtest";
      const apiGetSpy = vi.spyOn(api, "get");
      const fetchSpy = vi.spyOn(window, "fetch");
      const res = await api.get(testEndpoint);
      expect(res).toStrictEqual([
        null,
        { statusCode: 400, error: "someError", additionalInfo: {} },
      ]);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(apiGetSpy).toHaveBeenCalledWith(testEndpoint);
    });

    it("should always return same error message structure if server does not", async () => {
      const testEndpoint = "apierrtest2";
      const res = await api.get(testEndpoint);
      expect(res).toStrictEqual([
        null,
        { statusCode: 500, error: "", additionalInfo: {} },
      ]);
    });

    it("should catch errors when fetch operation fails", async () => {
      vi.spyOn(window, "fetch").mockRejectedValueOnce({ error: "whoops" });
      const testEndpoint = "apioktest";
      const res = await api.get(testEndpoint);
      expect(res).toStrictEqual([null, { error: "whoops" }]);
    });
  });

  describe("api.post", () => {
    it("should call fetch method with correct params for POST", async () => {
      const res = await api.post("apiposttest", { pay: "load" });
      expect(window.fetch).toBeCalledTimes(1);
      expect(window.fetch).toHaveBeenCalledWith(
        // base URL as defined in env file
        "http://api:5000/api/apiposttest",
        {
          method: "POST",
          body: JSON.stringify({ pay: "load" }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
      expect(res).toStrictEqual([null, null]);
    });
  });
});
