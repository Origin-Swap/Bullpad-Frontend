import React from 'react';

const Event = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="max-w-3xl w-full bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Event</h1>
        <p className="text-gray-600">
          This is the <strong>Event</strong> page. Check out the latest events, upcoming
          conferences, and webinars happening soon. Don&rsquo;t miss out!
        </p>
      </div>
    </div>
  );
};

export default Event;
