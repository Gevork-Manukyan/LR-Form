import Lawsuit from './components/Lawsuit';

function App() {
  return (
    <div className="app min-h-screen bg-gray-50 py-8">
      <div className="flex flex-col items-center gap-4">
        <Lawsuit />
        <Lawsuit />
      </div>
    </div>
  );
}

export default App;
