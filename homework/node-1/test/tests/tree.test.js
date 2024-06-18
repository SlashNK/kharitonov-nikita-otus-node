import mock from "mock-fs";
import { presentFilesAsTree, printTree } from "../../utils";

describe("File Tree Utils", () => {
  afterEach(() => {
    mock.restore();
  });

  describe("presentFilesAsTree", () => {
    it("should handle non-directory paths correctly", async () => {
      mock({
        "file.txt": "content",
      });

      const result = await presentFilesAsTree("file.txt", 1);
      expect(result).toEqual({ name: "file.txt" });
    });

    it("should represent directory tree structure correctly", async () => {
      mock({
        dir: {
          "file.txt": "content",
          subdir: {
            "file2.txt": "content",
          },
        },
      });

      const result = await presentFilesAsTree("dir", Infinity);
      expect(result).toEqual({
        items: [
          { name: "file.txt" },
          {
            items: [{ name: "file2.txt" }],
            name: "subdir",
          },
        ],
        name: "dir",
      });
    });

    it("should respect depth parameter", async () => {
      mock({
        dir: {
          subdir: {
            "file.txt": "content",
          },
          "file2.txt": "content",
        },
      });

      const result = await presentFilesAsTree("dir", 0);
      expect(result).toEqual({
        name: "dir",
      });
    });

    it("should handle errors correctly", async () => {
      mock({
        dir: mock.directory({
          items: {
            "file.txt": mock.file({ content: "content" }),
          },
        }),
      });

      const result = await presentFilesAsTree("nonExistentDir", 1);
      expect(result).toBeUndefined();
    });
  });

  describe("printTree", () => {
    it("should print tree structure correctly", () => {
      const tree = {
        name: "dir",
        items: [
          {
            name: "subdir",
            items: [{ name: "file.txt" }],
          },
          { name: "file2.txt" },
        ],
      };

      const result = printTree(tree);
      const expectedOutput = "dir\n├── subdir\n│ └── file.txt\n└── file2.txt";
      expect(result).toBe(expectedOutput);
    });
  });
});
