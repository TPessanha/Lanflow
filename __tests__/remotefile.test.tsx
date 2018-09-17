import React from "react";
import renderer from "react-test-renderer";
import RemoteFile from "../src/components/RemoteFile";

it("renders home correctly", () => {
	const tree = renderer
		.create(<RemoteFile />)
		.toJSON();
	expect(tree).toMatchSnapshot();
});
