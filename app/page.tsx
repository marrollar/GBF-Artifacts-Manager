import FileUpload from "./components/FileUpload";

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-center text-5xl"> GBF Artifacts Viewer</h1>
        <p className="text-center m-4">A helper web page to consolidate all of your artifacts into a more easily searchable/manipulable area.</p>
        <FileUpload />
      </div>
    </div>
  );
}
