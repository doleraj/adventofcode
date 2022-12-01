package y2017

import org.junit.Assert.assertEquals
import org.junit.Test
import java.io.File

class day9Test {

    @Test
    fun testGarbage1() {
        assertEquals(Pair(1, 0), parseGarbage("<>", 0))
    }

    @Test
    fun testGarbage2() {
        assertEquals(Pair(18, 17), parseGarbage("<random characters>", 0))
    }

    @Test
    fun testGarbage3() {
        assertEquals(Pair(4, 3), parseGarbage("<<<<>", 0))
    }

    @Test
    fun testGarbage4() {
        assertEquals(Pair(5, 2), parseGarbage("<{!>}>", 0))
    }

    @Test
    fun testGarbage5() {
        assertEquals(Pair(3, 0), parseGarbage("<!!>", 0))
    }

    @Test
    fun testGarbage6() {
        assertEquals(Pair(5, 0), parseGarbage("<!!!>>", 0))
    }

    @Test
    fun testGarbage7() {
        assertEquals(Pair(13, 10), parseGarbage("<{o\"i!a,<{i<a>", 0))
    }

    fun parseFile(name: String): Array<String> {
        val fileUri = javaClass.classLoader.getResource(name).toURI()
        val lines = MutableList(0, { "" })
        File(fileUri).forEachLine { line -> lines.add(line) }
        return lines.toTypedArray()
    }

    @Test
    fun testGroupCount1() {
        assertEquals(1, day9("{}").first)
    }

    @Test
    fun testGroupCount2() {
        assertEquals(3, day9("{{{}}}").first)
    }

    @Test
    fun testGroupCount3() {
        assertEquals(3, day9("{{},{}}").first)
    }

    @Test
    fun testGroupCount4() {
        assertEquals(6, day9("{{{},{},{{}}}}").first)
    }

    @Test
    fun testGroupCount5() {
        assertEquals(1, day9("{<{},{},{{}}>}").first)
    }

    @Test
    fun testGroupCount6() {
        assertEquals(1, day9("{<a>,<a>,<a>,<a>}").first)
    }

    @Test
    fun testGroupCount7() {
        assertEquals(5, day9("{{<a>},{<a>},{<a>},{<a>}}").first)
    }

    @Test
    fun testGroupCount8() {
        assertEquals(2, day9("{{<!>},{<!>},{<!>},{<a>}}").first)
    }

    @Test
    fun test1() {
        assertEquals(1, day9("{}").second)
    }

    @Test
    fun test2() {
        assertEquals(6, day9("{{{}}}").second)
    }

    @Test
    fun test3() {
        assertEquals(5, day9("{{},{}}").second)
    }

    @Test
    fun test4() {
        assertEquals(16, day9("{{{},{},{{}}}}").second)
    }

    @Test
    fun test5() {
        assertEquals(1, day9("{<a>,<a>,<a>,<a>}").second)
    }

    @Test
    fun test6() {
        assertEquals(9, day9("{{<ab>},{<ab>},{<ab>},{<ab>}}").second)
    }

    @Test
    fun test7() {
        assertEquals(9, day9("{{<!!>},{<!!>},{<!!>},{<!!>}}").second)
    }

    @Test
    fun test8() {
        assertEquals(3, day9("{{<a!>},{<a!>},{<a!>},{<ab>}}").second)
    }

    @Test
    fun testActual() {
        assertEquals(17390, day9(parseFile("2017/day9ActualInput.txt")[0]).second)
    }

    @Test
    fun testActualSecond() {
        assertEquals(7825, day9(parseFile("2017/day9ActualInput.txt")[0]).third)
    }
}