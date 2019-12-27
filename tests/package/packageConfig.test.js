const tmp = require("tmp");
const path = require("path");
const fs = require("fs");
const toml = require("@iarna/toml");
const packageConfig = require("../../package/packageConfig");

test("Import config file", () => {
  const config = packageConfig.getPackageConfig(
    path.join(__dirname, "clio.test.toml")
  );
  expect(config.title).toBeDefined();
});

test("Write config file", () => {
  const config = {
    title: "test",
    dependencies: [{ name: "Foo", version: "1.2.3" }]
  };

  const tmpDir = tmp.dirSync();
  const filePath = tmpDir.name;

  packageConfig.writePackageConfig(config, filePath);

  const file = fs.readFileSync(
    path.join(filePath, packageConfig.configFileName)
  );
  const contents = toml.parse(file.toString());
  expect(contents.title).toBe("test");
  expect(contents.dependencies).toEqual({ Foo: "1.2.3" });
  tmpDir.removeCallback();
});

test("hasVersion without version provided", () => {
  const gitHubPackage = "github.com/foo/bar";

  expect(packageConfig.hasVersion(gitHubPackage)).toBeFalsy();
});

test("hasVersion with version", () => {
  const gitHubPackageVersion = "github.com/foo/bar@1.2.3";

  expect(packageConfig.hasVersion(gitHubPackageVersion)).toBeTruthy();
  expect(packageConfig.getVersion(gitHubPackageVersion)).toBe("@1.2.3");
});
