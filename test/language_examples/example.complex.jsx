// Test case for complex expressions including ternary operators

const Example1 = () => {
	const value = true;
	return (
		<div
        className={`mr-2 transition-all duration-300 ${value ? 'text-red-500' : 'flex text-green-500  flex-1'} group-hover:text-[#1890ff]`}
      />
	);
};

const Example2 = () => {
	const isActive = false;
	return (
		<div
			className={`flex items-center ${
				isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
			} px-4 py-2`}
		>
			Another ternary
		</div>
	);
};

const Example3 = () => {
	return (
		<div
			className={`container mx-auto ${
				true ? 'border-2 border-red-500' : 'border border-gray-300'
			} rounded-lg`}
		>
			Nested classes
		</div>
	);
};

// Standard cases should still work
const Example4 = () => {
	return (
		<div className="flex items-center justify-center bg-white p-4">
			Normal case
		</div>
	);
};

const Example5 = () => {
	const classes = 'text-lg font-bold text-blue-600';
	return <div className={classes}>Variable case</div>;
};
