import React from "react";

export interface IRemoteFileProps {
    mobileName: string;
}

// IRemoteFileProps describes RemoteFile properties
export class RemoteFile extends React.Component<IRemoteFileProps> {
    public render() {
        return (
            <div>
                <h1>
                    This is where you browse for files in your phone.
                </h1>
            </div>
        );
    }
}