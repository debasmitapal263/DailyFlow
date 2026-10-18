import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const GoogleDriveScreen: React.FC = () => {
  const {
    googleDrive,
    connectGoogleDrive,
    disconnectGoogleDrive,
    uploadReportToDrive,
    downloadReportLocal,
  } = useApp();

  const [folderName, setFolderName] = useState(googleDrive.folderName);
  const [autoDaily, setAutoDaily] = useState(googleDrive.autoUploadDaily);
  const [autoWeekly, setAutoWeekly] = useState(googleDrive.autoUploadWeekly);
  const [isUploadingManual, setIsUploadingManual] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleManualUpload = async () => {
    setIsUploadingManual(true);
    setStatusMessage('Uploading DayFlow_Daily_2024-10-24.pdf to Google Drive...');
    const success = await uploadReportToDrive(`DayFlow_Daily_2024-10-24.pdf`, 'daily');
    setIsUploadingManual(false);
    if (success) {
      setStatusMessage('Upload completed successfully!');
    } else {
      setStatusMessage('Upload failed. Please check connection.');
    }
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-4 space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1b1c1a] tracking-tight">
          Cloud Backup & Reports (Google Drive)
        </h1>
        <p className="text-xs sm:text-sm text-[#3d4947]">
          Automatically synchronize daily audits, research work records, and weekly CSV/PDF summaries to your Google Drive.
        </p>
      </div>

      {/* Connection Status Card */}
      <div className="p-5 rounded-2xl bg-white border border-[#e6e2d8] shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#efeeea] flex items-center justify-center text-[#00685f]">
              <span className="material-symbols-outlined text-[28px]">add_to_drive</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-semibold text-[#1b1c1a]">
                  Google Drive Account
                </h2>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                    googleDrive.connected
                      ? 'bg-[#89f5e7]/40 text-[#005049]'
                      : 'bg-[#eae8e4] text-[#6d7a77]'
                  }`}
                >
                  {googleDrive.connected ? 'Connected' : 'Not Connected'}
                </span>
              </div>
              <p className="text-xs text-[#6d7a77] mt-0.5">
                {googleDrive.connected
                  ? `Authorized for ${googleDrive.accountEmail}`
                  : 'Grant read/write access to dedicated DayFlow report folders'}
              </p>
            </div>
          </div>

          {googleDrive.connected ? (
            <button
              onClick={disconnectGoogleDrive}
              className="px-3 py-1.5 rounded-lg border border-[#e6e2d8] text-xs text-[#ba1a1a] hover:bg-[#ffdad6]/30 font-medium transition-colors"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={connectGoogleDrive}
              className="px-4 py-2 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">key</span>
              <span>Connect Google Drive</span>
            </button>
          )}
        </div>

        {googleDrive.connected && (
          <div className="pt-3 border-t border-[#efeeea] space-y-3">
            {/* Target Folder */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#3d4947]">Destination Folder</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 bg-[#f5f3ef] px-3 py-2 rounded-lg border border-[#e6e2d8]">
                  <span className="material-symbols-outlined text-[18px] text-[#00685f]">folder</span>
                  <input
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    className="bg-transparent text-xs text-[#1b1c1a] font-semibold w-full focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => alert(`Saved destination folder: ${folderName}`)}
                  className="px-3 py-2 bg-[#eae8e4] hover:bg-[#e4e2de] rounded-lg text-xs font-medium text-[#1b1c1a]"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Sync Toggles */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f5f3ef]">
                <div>
                  <span className="text-xs font-semibold text-[#1b1c1a] block">
                    Automatic Daily Upload
                  </span>
                  <span className="text-[11px] text-[#6d7a77]">
                    Uploads summary PDF after completing 2-min Daily Review
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoDaily}
                  onChange={(e) => setAutoDaily(e.target.checked)}
                  className="w-4 h-4 accent-[#00685f] rounded"
                />
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f5f3ef]">
                <div>
                  <span className="text-xs font-semibold text-[#1b1c1a] block">
                    Automatic Weekly Upload
                  </span>
                  <span className="text-[11px] text-[#6d7a77]">
                    Uploads weekly productivity & well-being audit every Sunday night
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoWeekly}
                  onChange={(e) => setAutoWeekly(e.target.checked)}
                  className="w-4 h-4 accent-[#00685f] rounded"
                />
              </div>
            </div>

            {/* Manual Sync Trigger */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-[#6d7a77]">
                Last cloud sync: <strong className="text-[#1b1c1a] font-mono">{googleDrive.lastUploadTimestamp}</strong>
              </span>

              <button
                onClick={handleManualUpload}
                disabled={isUploadingManual}
                className="px-3.5 py-2 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-75"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isUploadingManual ? 'refresh' : 'sync'}
                </span>
                <span>{isUploadingManual ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            </div>

            {statusMessage && (
              <div className="p-2 text-center text-xs font-mono text-[#00685f] bg-[#89f5e7]/30 rounded-lg font-semibold animate-in fade-in">
                {statusMessage}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload History / Log Table */}
      <div className="bg-white rounded-2xl border border-[#e6e2d8] shadow-xs p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#1b1c1a]">Cloud Sync Activity Log</h3>
          <span className="font-mono text-xs text-[#6d7a77]">
            {googleDrive.uploadHistory.length} files tracked
          </span>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e6e2d8] text-[#6d7a77] font-mono text-[11px]">
                <th className="py-2">File Name</th>
                <th className="py-2">Type</th>
                <th className="py-2">Size</th>
                <th className="py-2">Synced At</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efeeea]">
              {googleDrive.uploadHistory.map((item) => (
                <tr key={item.id} className="hover:bg-[#fbf9f5]">
                  <td className="py-2.5 font-mono text-[#1b1c1a] font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#00685f]">
                      description
                    </span>
                    <span>{item.fileName}</span>
                  </td>
                  <td className="py-2.5 uppercase font-mono text-[11px] text-[#6d7a77]">
                    {item.type}
                  </td>
                  <td className="py-2.5 font-mono text-[#6d7a77]">{item.sizeKb} KB</td>
                  <td className="py-2.5 font-mono text-[#6d7a77]">{item.timestamp}</td>
                  <td className="py-2.5">
                    {item.status === 'success' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#89f5e7]/40 text-[#005049] font-mono">
                        Synced
                      </span>
                    )}
                    {item.status === 'uploading' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#dbe1ff] text-[#00174b] font-mono animate-pulse">
                        Uploading...
                      </span>
                    )}
                    {item.status === 'failed' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ffdad6] text-[#93000a] font-mono">
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() =>
                        downloadReportLocal(
                          item.fileName.replace('.pdf', ''),
                          'DayFlow Export Content',
                          'pdf'
                        )
                      }
                      className="text-xs text-[#00685f] hover:underline font-medium"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
