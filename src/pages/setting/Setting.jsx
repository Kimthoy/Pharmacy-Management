import React, { useState } from "react";
import { FaCog, FaUsers, FaLock, FaShieldAlt, FaHistory } from "react-icons/fa";

const Setting = () => {
  const [activeTab, setActiveTab] = useState("General");
  const [registrationOption, setRegistrationOption] = useState("Enable");
  // const [isEnabled, setIsEnabled] = useState(true);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const settings = {
    pharmacyName: "Dashlite",
    pharmacyAddress: "Softnio Street 3",
    copyright: "© 2019, DashLite. All Rights Reserved.",
    site: "www.panharithphamacy.com",
  };

  const [selectedMember, setSelectedMember] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("Pharmacist");
  const [members, setMembers] = useState([
    {
      name: "Abu Bin Ishtiyak",
      email: "info@softnio.com",
      role: "Admin",
      joinedOn: "10 Feb 2020",
    },
    {
      name: "Ashley Lawson",
      email: "AshleyLawson@.com",
      role: "Manager",
      joinedOn: "17 Feb 2020",
    },
  ]);

  const handleAddMember = () => {
    if (selectedMember) {
      setMembers([
        ...members,
        {
          name: selectedMember,
          email: "",
          role: selectedDesignation,
          joinedOn: "-",
        },
      ]);
      setSelectedMember("");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "General":
        return (
          <div>
            <h2 className="text-2xl font-semibold">General Settings</h2>
            <p className="text-gray-600 mb-6">
              These settings helps you modify site settings.
            </p>

            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Pharmacy Name
                </label>
                <span
                  lassName="ai-font-italic"
                  className="italic text-xs text-gray-400"
                >
                  Specify the name of your pharmacy.
                </span>
                <input
                  type="text"
                  placeholder={settings.pharmacyName}
                  className="w-full border rounded-lg p-2 mt-1 focus:outline focus:outline-green-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Pharmacy Address
                </label>
                <span
                  lassName="ai-font-italic"
                  className="italic text-xs text-gray-400"
                >
                  Specify the key of your pharmacy address.
                </span>
                <input
                  type="text"
                  placeholder={settings.pharmacyAddress}
                  className="w-full border rounded-lg p-2 mt-1 focus:outline focus:outline-green-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Copyright
                </label>
                <span
                  lassName="ai-font-italic"
                  className="italic text-xs text-gray-400"
                >
                  Copyright information of your pharmacy.
                </span>
                <input
                  type="text"
                  placeholder={settings.copyright}
                  className="w-full border rounded-lg p-2 mt-1 focus:outline focus:outline-green-500"
                />
              </div>
              <div className="mb-4">
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium ">
                    Allow Registration
                  </label>
                  <span
                    lassName="ai-font-italic"
                    className="italic text-xs text-gray-400"
                  >
                    Enable or disable registration from site.
                  </span>

                  <div className="flex mt-3 space-x-6">
                    {/* Enable Option */}
                    <div
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={() => setRegistrationOption("Enable")}
                    >
                      <input
                        type="radio"
                        id="enable"
                        name="registration"
                        value="Enable"
                        checked={registrationOption === "Enable"}
                        onChange={() => setRegistrationOption("Enable")}
                        className="hidden"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          registrationOption === "Enable"
                            ? "border-green-500"
                            : "border-gray-400"
                        }`}
                      >
                        {registrationOption === "Enable" && (
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      <label
                        htmlFor="enable"
                        className={`cursor-pointer ${
                          registrationOption === "Enable"
                            ? "text-green-600 font-semibold"
                            : "text-gray-600"
                        }`}
                      >
                        Enable
                      </label>
                    </div>

                    {/* Disable Option */}
                    <div
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={() => setRegistrationOption("Disable")}
                    >
                      <input
                        type="radio"
                        id="disable"
                        name="registration"
                        value="Disable"
                        checked={registrationOption === "Disable"}
                        onChange={() => setRegistrationOption("Disable")}
                        className="hidden"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          registrationOption === "Disable"
                            ? "border-green-500"
                            : "border-gray-400"
                        }`}
                      >
                        {registrationOption === "Disable" && (
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      <label
                        htmlFor="disable"
                        className={`cursor-pointer ${
                          registrationOption === "Disable"
                            ? "text-green-600 font-semibold"
                            : "text-gray-600"
                        }`}
                      >
                        Disable
                      </label>
                    </div>

                    {/* On Request Option */}
                    <div
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={() => setRegistrationOption("On Request")}
                    >
                      <input
                        type="radio"
                        id="on-request"
                        name="registration"
                        value="On Request"
                        checked={registrationOption === "On Request"}
                        onChange={() => setRegistrationOption("On Request")}
                        className="hidden"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          registrationOption === "On Request"
                            ? "border-green-500"
                            : "border-gray-400"
                        }`}
                      >
                        {registrationOption === "On Request" && (
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      <label
                        htmlFor="on-request"
                        className={`cursor-pointer ${
                          registrationOption === "On Request"
                            ? "text-green-600 font-semibold"
                            : "text-gray-600"
                        }`}
                      >
                        On Request
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Main Site
                </label>
                <span
                  lassName="ai-font-italic"
                  className="italic text-xs text-gray-400"
                >
                  Specify the URL if your main website is external.
                </span>
                <input
                  type="text"
                  placeholder={settings.site}
                  className="w-full border rounded-lg p-2 mt-1 focus:outline focus:outline-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Description
                </label>
                <span
                  lassName="ai-font-italic"
                  className="italic text-xs text-gray-400"
                >
                  Describe your pharmacy information.
                </span>
                <textarea
                  type="text"
                  placeholder=""
                  className="w-full h-40 border rounded-lg p-2 mt-1 focus:outline focus:outline-green-500"
                ></textarea>
              </div>
              <div className="mb-4">
                {/* Maintenance Mode Toggle */}
                <div>
                  <label className="block text-gray-700 font-medium text-lg">
                    Maintenance Mode
                  </label>
                  <span className="italic text-sm text-gray-500">
                    Enable to make the project offline.
                  </span>

                  <div className="flex items-center mt-3">
                    <button
                      className={`relative w-14 h-7 rounded-full transition duration-300 focus:outline-none shadow-inner ${
                        isMaintenance ? "bg-green-500" : "bg-gray-400"
                      }`}
                      onClick={() => setIsMaintenance(!isMaintenance)}
                    >
                      <div
                        className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                          isMaintenance ? "translate-x-7" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                    <span className="text-gray-600 ml-3">Offine</span>
                  </div>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-teal-500 px-4 py-3 text-white rounded-md shadow-md active:shadow-none active:cursor-progress mt-6"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        );

      case "Members":
        return (
          <div>
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h2 className="text-2xl font-semibold">Member Settings</h2>
              <p className="text-gray-600 mb-4">
                These settings help you add or manage users.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block font-medium">Select Member</label>
                  <select
                    className="w-full border rounded-lg p-2 mt-1"
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                  >
                    <option value="">Select a Member</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium">
                    Select Designation
                  </label>
                  <select
                    className="w-full border rounded-lg p-2 mt-1"
                    value={selectedDesignation}
                    onChange={(e) => setSelectedDesignation(e.target.value)}
                  >
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="Manager">Manager</option>
                    <option value="Assistant">Assistant</option>
                  </select>
                </div>
              </div>

              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={handleAddMember}
              >
                Add Selected
              </button>

              <table className="w-full mt-6 border rounded-lg">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Name</th>
                    <th className="p-2">Email Address</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Joined On</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{member.name}</td>
                      <td className="p-2">{member.email}</td>
                      <td className="p-2">{member.role}</td>
                      <td className="p-2">{member.joinedOn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "E-mail":
        return (
          <div>
            <h2 className="text-2xl font-semibold">Email Settings</h2>
            <p className="text-gray-600 mb-6">Manage email notifications.</p>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <p>Email settings are not configured yet.</p>
            </div>
          </div>
        );

      case "Security":
        return (
          <div>
            <h2 className="text-2xl font-semibold">Security Settings</h2>
            <p className="text-gray-600 mb-6">Manage security options.</p>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <p>Security settings are currently unavailable.</p>
            </div>
          </div>
        );

      case "Account activity":
        return (
          <div>
            <h2 className="text-2xl font-semibold">Account Activity</h2>
            <p className="text-gray-600 mb-6">View recent account activity.</p>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <p>No recent activity.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div>
        <label htmlFor="" className="text-2xl font-semibold text-green-600">
          Setting Management
        </label>
        <p className="mb-3 text-gray-400 font-normal">
          There are all setting may hepl you controller your page.
        </p>
      </div>
      <div className="flex  h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg p-4 rounded-md mt-11">
          <h2 className="text-xl font-semibold ">Settings</h2>
          <p className="mb-6 text-sm text-gray-400">
            Here you can change and edit your needs
          </p>

          <ul className="space-y-4">
            <li
              className={`flex items-center space-x-3 cursor-pointer ${
                activeTab === "General"
                  ? "text-green-600 font-semibold"
                  : "text-gray-600 hover:text-green-600"
              }`}
              onClick={() => setActiveTab("General")}
            >
              <FaCog />
              <span>General</span>
            </li>
            <li
              className={`flex items-center space-x-3 cursor-pointer ${
                activeTab === "Members"
                  ? "text-green-600 font-semibold"
                  : "text-gray-600 hover:text-green-600"
              }`}
              onClick={() => setActiveTab("Members")}
            >
              <FaUsers />
              <span>Members</span>
            </li>
            <li
              className={`flex items-center space-x-3 cursor-pointer ${
                activeTab === "E-mail"
                  ? "text-green-600 font-semibold"
                  : "text-gray-600 hover:text-green-600"
              }`}
              onClick={() => setActiveTab("E-mail")}
            >
              <FaLock />
              <span>E-mail</span>
            </li>
            <li
              className={`flex items-center space-x-3 cursor-pointer ${
                activeTab === "Security"
                  ? "text-green-600 font-semibold"
                  : "text-gray-600 hover:text-green-600"
              }`}
              onClick={() => setActiveTab("Security")}
            >
              <FaShieldAlt />
              <span>Security</span>
            </li>
            <li
              className={`flex items-center space-x-3 cursor-pointer ${
                activeTab === "Account activity"
                  ? "text-green-600 font-semibold"
                  : "text-gray-600 hover:text-green-600"
              }`}
              onClick={() => setActiveTab("Account activity")}
            >
              <FaHistory />
              <span>Account activity</span>
            </li>
          </ul>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-8">{renderContent()}</div>
      </div>
    </>
  );
};

export default Setting;
