"use client";

import { NextPage } from "next";
import { livepeerClient } from "~~/utils/livepeer/livepeer";

const LivepeerTest: NextPage = async () => {

    const { stream } = await livepeerClient.stream.create({
        name: "Hello from JS SDK!",
    });
    console.log("stream", stream);

    return (
        <>
            <div>hi</div>
        </>
    );
};

export default LivepeerTest;
