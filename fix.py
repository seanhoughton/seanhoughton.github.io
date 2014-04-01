import os
import glob


for f in glob.glob('*.markdown'):
    with open(f, 'r') as fr:
        lines = fr.readlines()
    yaml_lines = []
    for index, line in enumerate(lines):
        if '---' in line:
            yaml_lines.append(index)

    if len(yaml_lines) != 2:
        print('Skipping {} - it was missing yaml'.format(f))
        continue

    parts = os.path.splitext(f)[0].split('-')
    a = '/{}/{}/{}/index.html\n'.format(parts[0], parts[1], '-'.join(parts[3:]))
    added = 'alias: {}'.format(a)
    lines.insert(yaml_lines[1], added)
    with open(f, 'w') as fw:
        fw.write(''.join(lines))
    #break