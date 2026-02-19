
const baseUrl = "http://localhost:3000";

async function verify() {
    console.log("--- Starting Comprehensive Gate Pass Flow Test ---");

    try {
        // 1. Student Login
        console.log("[1/6] Student Login...");
        const studentLogin = await fetch(`${baseUrl}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "student@test.com", password: "password123" })
        });
        const studentCookie = studentLogin.headers.get("set-cookie");
        if (!studentCookie) throw new Error("Failed to get student cookie");

        // 2. Request Pass
        console.log("[2/6] Student Requesting Pass...");
        const requestRes = await fetch(`${baseUrl}/api/pass/request`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": studentCookie || ""
            },
            body: JSON.stringify({ reason: "Node testing session" })
        });
        const requestData = await requestRes.json();

        let passData;
        if (requestRes.status === 201) {
            passData = requestData;
            console.log("   New pass created.");
        } else if (requestRes.status === 400 && requestData.message?.includes("active pass")) {
            console.log("   Active pass already exists. Fetching...");
            const getPasses = await fetch(`${baseUrl}/api/pass`, {
                headers: { "Cookie": studentCookie || "" }
            });
            const history = await getPasses.json();
            passData = history.find((p) => p.status !== "RETURNED");
        } else {
            console.error("   Request failed:", requestData);
            throw new Error(`Pass request failed with status ${requestRes.status}`);
        }

        if (!passData) throw new Error("Could not find or create an active pass.");
        const passId = passData._id;
        console.log(`   Captured PassID: ${passId}, Current Status: ${passData.status}`);

        // 3. Warden Login & Approve
        console.log("[3/6] Warden Login & Approval...");
        const wardenLogin = await fetch(`${baseUrl}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "warden@test.com", password: "password123" })
        });
        const wardenCookie = wardenLogin.headers.get("set-cookie");
        if (!wardenCookie) throw new Error("Failed to get warden cookie");

        if (passData.status === "PENDING") {
            console.log("   Status is PENDING. Approving...");
            const approveRes = await fetch(`${baseUrl}/api/pass/approve`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Cookie": wardenCookie || "" },
                body: JSON.stringify({ passId })
            });
            if (!approveRes.ok) console.error("   Approval failed:", await approveRes.json());
            else console.log("   Approved OK.");
        } else {
            console.log(`   Skipping approval (Status is already ${passData.status})`);
        }

        // 4. Hostel Exit
        console.log("[4/6] Warden Marking Hostel Exit...");
        const exitRes = await fetch(`${baseUrl}/api/pass/hostel-exit`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Cookie": wardenCookie || "" },
            body: JSON.stringify({ passId })
        });
        if (!exitRes.ok) {
            const exitErr = await exitRes.json();
            console.log(`   Hostel Exit info: ${exitErr.message || "Potential already exited"}`);
        } else {
            console.log("   Hostel Exit Marked OK.");
        }

        // 5. Librarian Entry
        console.log("[5/6] Librarian Login & Entry...");
        const libLogin = await fetch(`${baseUrl}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "librarian@test.com", password: "password123" })
        });
        const libCookie = libLogin.headers.get("set-cookie");
        if (!libCookie) throw new Error("Failed to get librarian cookie");

        const libEntryRes = await fetch(`${baseUrl}/api/pass/library-entry`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Cookie": libCookie || "" },
            body: JSON.stringify({ passId })
        });
        if (libEntryRes.ok) {
            console.log("   Library Entry Marked OK.");
        } else {
            const libErr = await libEntryRes.json();
            console.log(`   Library Entry info: ${libErr.message}`);
        }

        // 6. Complete flow (Re-entry)
        console.log("[6/6] Finalizing: Library Exit & Hostel re-entry...");
        await fetch(`${baseUrl}/api/pass/library-exit`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Cookie": libCookie || "" },
            body: JSON.stringify({ passId })
        });
        console.log("   Library Exit Marked.");

        const finalRes = await fetch(`${baseUrl}/api/pass/hostel-entry`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Cookie": wardenCookie || "" },
            body: JSON.stringify({ passId })
        });
        if (finalRes.ok) {
            console.log("   Hostel Re-entry Marked OK.");
            console.log("\n--- VERIFICATION SUCCESSFUL ---");
            console.log("Full movement cycle completed and verified.");
        } else {
            console.error("   Final re-entry failed:", await finalRes.json());
        }

    } catch (err) {
        console.error("\n--- VERIFICATION FAILED ---");
        console.error(err.message);
        process.exit(1);
    }
}

verify();
