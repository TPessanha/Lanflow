import React from "react";
import renderer from "react-test-renderer";
import Home from "../src/components/Home";

it("renders home correctly", () => {
	const tree = renderer.create(<Home />).toJSON();
	expect(tree).toMatchSnapshot();
});
