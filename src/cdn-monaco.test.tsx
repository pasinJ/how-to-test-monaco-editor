import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import waitForExpect from "wait-for-expect";
import App from "./App";
import {
  ScriptsObserver,
  mockForMonaco,
  revertMockForMonaco,
  createScriptsObserver,
  getLoadedScripts,
} from "../test-util";

let scriptsObserver: ScriptsObserver;

beforeAll(() => {
  mockForMonaco();
});
beforeEach(() => {
  scriptsObserver = createScriptsObserver();
});
afterAll(() => {
  revertMockForMonaco();
});

it("Test monaco editor", async () => {
  render(<App />);

  const editor = await screen.findByRole("textbox");
  expect(editor).toBeInTheDocument();

  // Wait all the Monaco script to be loaded
  await waitForExpect(() => {
    expect(
      getLoadedScripts(scriptsObserver.getScriptStatus()).length
    ).toBeGreaterThanOrEqual(5);
  });

  const user = userEvent.setup();
  await user.type(editor, 'console.log("Hello");');

  await expect(
    screen.findByDisplayValue('console.log("Hello");')
  ).resolves.toBeInTheDocument();
});
