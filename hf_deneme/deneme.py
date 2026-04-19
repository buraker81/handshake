from huggingface_hub import HfApi

repo_id = "prism-ml/Ternary-Bonsai-8B-mlx-2bit"
api = HfApi()

# Get information about the repository
repo_info = api.repo_info(repo_id=repo_id, files_metadata=True)

print(f"Files in repository: {repo_id}\n")

# Iterate through the files and print their names and sizes
for file in repo_info.siblings:
    size_mb = file.size / (1024 * 1024) if file.size else 0
    print(f"- {file.rfilename} ({size_mb:.2f} MB)")