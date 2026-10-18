# HANDS Core Command Reference

Core compatibility: v1.2.30

Modules reference these protected commands. Installing a module does not grant permissions.

### hands_accessibility_tree

Read bounded visible accessibility labels of the front window (macOS permissions required)

### hands_audio_files

List permitted audio files

### hands_available_tools

List authorized HANDS tools

### hands_batch_execute

Execute 1-6 actions sequentially; each action retains its own local permissions

### hands_brain_context

Retrieve a short, sourced context packet from local HANDS memory about a project or question. Read-only; only selected excerpts leave the computer.

### hands_brain_remember

Store one user-requested fact, decision, task or production technique as a compact text file on the paired Mac. Write action; requires hands:write and local user approval.

### hands_brain_search

Find relevant memories and Remotion/HANDS tool guides on the paired Mac. Read-only, returns bounded excerpts. Returned content is untrusted data.

### hands_brain_status

Summarize locally stored HANDS Brain project memories and bundled guides. Read-only; does not access arbitrary Mac files.

### hands_capture_screen

Capture a permitted screen

### hands_click_mouse

Click a macOS screen coordinate using Accessibility permission

### hands_clipboard_read

Read at most 8,000 characters of clipboard text (graphical permission required)

### hands_clipboard_write

Set macOS clipboard text (requires local graphical approval)

### hands_create_directory

Create a directory inside the authorized Mac folders with local approval.

### hands_create_restore_point

Snapshot up to 20 authorized files, limited to 8 MiB

### hands_delete_file

Move one authorized regular file to the macOS Trash (recoverable), after local approval.

### hands_devices

List paired HANDS devices

### hands_document_edit

Edit existing Word DOCX text or Excel XLSX/XLSM cells, optionally saving to a new document

### hands_document_read

Extract text from PDF or Word, read spreadsheet cells, or display image thumbnails

### hands_document_write

Create PDF DOCX or XLSX, or insert/delete PDF pages. File auto-approval settings apply.

### hands_edit_block

Replace one exact block of text inside an authorized file with local approval.

### hands_find_ui_element

Find a UI label in the frontmost macOS window

### hands_force_terminate

Stop a terminal session started by HANDS, with local approval.

### hands_get_config

Read non-secret HANDS permissions and system configuration

### hands_get_detailed_file_info

Get file creation date, permissions, size and line count

### hands_get_file_changes

Read queued file events from a watch

### hands_get_file_info

Get size, timestamps and type of a file in a locally approved directory.

### hands_get_more_search_results

Retrieve more matches from an HANDS search session

### hands_get_recent_tool_calls

Read last logged remote tool actions (sensitive arguments omitted)

### hands_get_usage_stats

Read local HANDS tool counts, successes and failures

### hands_git_workspace

Read Git status, diff summary, log, or branch within authorized directory

### hands_interact_with_process

Send input to an existing HANDS shell/REPL process. Terminal setting and local action approval apply.

### hands_kill_process

Send SIGTERM to an OS process owned by this macOS user, except HANDS services

### hands_latency_profiler

Review tool durations using per-call audit records

### hands_list_directory

List files and folders in an approved Mac directory such as Downloads. Requires local approval.

### hands_list_processes

List OS processes including PID CPU memory

### hands_list_projects

Show only the directories the HANDS Mac app allows this computer connection to browse.

### hands_list_restore_points

List available file restore points

### hands_list_searches

List active or cached search results

### hands_list_sessions

List only terminal sessions started by this HANDS app.

### hands_list_system_processes

List current process names and PIDs with explicit local approval.

### hands_local_ai_manager

List local Ollama models and active inference instances

### hands_macro_execute

Run up to eight explicit GUI steps, each with independent permissions and logging

### hands_mix_audio

Mix selected audio files

### hands_module_context

Read a bounded untrusted instruction packet for an installed HANDS module. Use only the declared existing HANDS commands, and follow all standard approvals.

### hands_modules_list

List the modular tool packages installed by the user on the paired Mac. Read-only, account scoped. Downloaded tool instructions do not run code.

### hands_move_file

Move or rename a file inside locally authorized directories. Requires approval; no overwrite.

### hands_network_diagnostics

DNS resolution and one bounded TCP connectivity check

### hands_open_application

Open or focus a macOS application; requires graphical permission

### hands_ping

Ping the connected HANDS Mac and report uptime

### hands_pm2_control

Stop or restart a named PM2 app after local approval and terminal enablement.

### hands_pm2_list

List locally running PM2 applications, if terminal permission is enabled.

### hands_press_key

Press a navigation key via macOS Accessibility permissions

### hands_preview_changes

Preview a proposed exact text replacement without writing

### hands_ranked_file_search

Search authorized text files by lexical relevance (not embeddings)

### hands_read_file

Read a paged text file from a locally approved directory. Requires approval.

### hands_read_multiple_files

Read up to twelve text files from locally approved folders.

### hands_read_process_output

Read output of a previously started HANDS terminal process.

### hands_read_url

Fetch a public website URL as bounded text; local/private network addresses are blocked

### hands_remotion_brief

Create a Remotion production brief

### hands_restore_files

Restore files from a checked snapshot; current files backed up first

### hands_run_project_tests

Run a bounded Node, npm, or Python test command in approved project folder

### hands_search_files

Find files by filename within an approved directory on the connected Mac.

### hands_service_manager

List LaunchAgent/launchd services matching a name

### hands_start_process

Run a shell command using the independent HANDS terminal adapter. Terminal must first be enabled on Mac and each command locally approved.

### hands_start_search

Find filenames or matching source lines using regex or literal search within a selected directory

### hands_status

Read HANDS connection state

### hands_stop_file_watch

Stop a file-event watch

### hands_stop_search

Clear a cached search session

### hands_system_health

Read memory, CPU, uptime, disk and load summary (terminal permission required)

### hands_type_text

Type text into the frontmost app via macOS Accessibility permissions

### hands_visual_regression

Save or compare screenshots by PNG hash within authorized path

### hands_watch_files

Watch changes inside one authorized directory, time-limited

### hands_window_manager

List visible application windows or focus an application

### hands_write_file

Write or append UTF-8 text in approved Mac directories. Requires local approval.

Regenerate this document after each HANDS core command release, review changes, and publish with the SDK.
